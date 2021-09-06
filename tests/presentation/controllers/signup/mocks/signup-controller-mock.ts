import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { User, UserAccount } from '@/domain/user'
import { SignUpController } from '@/presentation/controllers/signup/signup-controllers'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountDbRepository = (): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(makeFakeUser())
    }
  }

  return new AccountDbRepositoryStub()
}

export interface SutTypes {
  sut: SignUpController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const accountDbRepositoryStub = makeAccountDbRepository()
  const sut = new SignUpController(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub }
}
