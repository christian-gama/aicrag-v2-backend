import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { UserAccount, User } from '@/domain/user'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountDbRepository implements AccountDbRepositoryProtocol {
  private readonly collection = MongoHelper.getCollection('accounts')

  constructor (private readonly accountRepository: AccountRepositoryProtocol) {}

  async saveAccount (account: UserAccount): Promise<User> {
    const user = await this.accountRepository.createAccount(account)

    const insertedResult = await this.collection.insertOne(user)

    return (await this.collection.findOne(insertedResult.insertedId)) as User
  }

  async findAccountByEmail (email: string): Promise<User | undefined> {
    const account = (await this.collection.findOne({ 'personal.email': email })) as User

    if (account) return account
  }
}
