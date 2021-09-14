import { User, UserAccount } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/infra/database/mongodb/account'
import { UpdateUserOptions } from '@/infra/database/mongodb/account/protocols/update-user-options'

export const makeAccountDbRepositoryStub = (fakeUser: User): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }

    async updateUser (user: User, update: UpdateUserOptions): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountDbRepositoryStub()
}
