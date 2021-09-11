import { User, UserAccount } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import {
  ValidateActiveAccount,
  ValidatorProtocol
} from '@/application/usecases/validators/credentials/'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountDbRepositoryStub = (fakeUser: User): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
    }

    async findAccountByEmail (email: string): Promise<User | undefined> {
      return Promise.resolve(fakeUser)
    }
  }

  return new AccountDbRepositoryStub()
}

interface SutTypes {
  sut: ValidatorProtocol
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  fakeUser.settings.accountActivated = true

  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const sut = new ValidateActiveAccount(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
