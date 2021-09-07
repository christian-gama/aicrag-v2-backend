import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { UserAccount, User } from '@/domain/user'
import { MongoHelper } from '../helper/mongo-helper'

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
}
