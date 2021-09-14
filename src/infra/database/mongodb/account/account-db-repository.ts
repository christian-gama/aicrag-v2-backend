import { SignUpUserCredentials, User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UpdateUserOptions } from '@/infra/database/mongodb/account/protocols/update-user-options'

export class AccountDbRepository implements AccountDbRepositoryProtocol {
  constructor (private readonly accountRepository: AccountRepositoryProtocol) {}

  async saveAccount (account: SignUpUserCredentials): Promise<User> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const user = await this.accountRepository.createAccount(account)

    const insertedResult = await accountCollection.insertOne(user)

    return (await accountCollection.findOne(insertedResult.insertedId)) as User
  }

  async findAccountByEmail (email: string): Promise<User | undefined> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const filter: UpdateUserOptions = { 'personal.email': email }

    const account = (await accountCollection.findOne(filter)) as User

    if (account) return account
  }

  async updateUser (user: User, update: UpdateUserOptions): Promise<User | undefined> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const filter: UpdateUserOptions = { 'personal.id': user.personal.id }

    await accountCollection.updateOne(filter, { $set: update })

    const updatedUser = (await accountCollection.findOne(filter)) as User

    if (updatedUser) return updatedUser
  }
}
