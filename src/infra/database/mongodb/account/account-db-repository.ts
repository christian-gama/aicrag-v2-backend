import { UserAccount, User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { MongoHelper } from '@/infra/database/mongodb/helper/mongo-helper'
import { UpdateUserOptions } from '@/domain/user/update-user-options'

export class AccountDbRepository implements AccountDbRepositoryProtocol {
  constructor (private readonly accountRepository: AccountRepositoryProtocol) {}

  async saveAccount (account: UserAccount): Promise<User> {
    const accountCollection = await MongoHelper.getCollection('accounts')
    const user = await this.accountRepository.createAccount(account)

    const insertedResult = await accountCollection.insertOne(user)

    return (await accountCollection.findOne(insertedResult.insertedId)) as User
  }

  async findAccountByEmail (email: string): Promise<User | undefined> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = (await accountCollection.findOne({ 'personal.email': email })) as User

    if (account) return account
  }

  async updateUser (user: User, update: UpdateUserOptions): Promise<User | undefined> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne({ 'personal.id': user.personal.id }, { $set: update })

    const updatedUser = (await accountCollection.findOne({
      'personal.id': user.personal.id
    })) as User

    if (updatedUser) return updatedUser
  }
}
