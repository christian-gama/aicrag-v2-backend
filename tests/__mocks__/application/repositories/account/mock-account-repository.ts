import { User, UserAccount } from '@/domain/user'
import { AccountRepositoryProtocol } from '@/application/usecases/repositories/account'

export const makeAccountRepositoryStub = (fakeUser: User): AccountRepositoryProtocol => {
  class AccountRepositoryStub implements AccountRepositoryProtocol {
    async createAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountRepositoryStub()
}
