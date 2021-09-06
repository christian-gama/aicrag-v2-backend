import { AccountRepositoryProtocol } from '@/application/protocols/repositories/account/account-repository-protocol'
import { UserAccount, User } from '@/domain/user'
import { MongoHelper } from '../helper/mongo-helper'

export class AccountMongoRepository {
  constructor (private readonly accountRepository: AccountRepositoryProtocol) {}

  async saveAccount (account: UserAccount): Promise<User> {
    const accountCollection = MongoHelper.getCollection('accounts')

    const user = this.accountRepository.createAccount(account)

    const insertedResult = await accountCollection.insertOne(user)

    return (await accountCollection?.findOne(insertedResult.insertedId)) as User
  }
}
