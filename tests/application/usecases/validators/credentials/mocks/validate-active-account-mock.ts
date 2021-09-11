import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User, UserAccount } from '@/domain/user'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidateActiveAccount } from '@/application/usecases/validators/credentials/validate-active-account'

const fakeUser = makeFakeUser()
fakeUser.settings.accountActivated = true

const makeAccountDbRepositoryStub = (): AccountDbRepositoryProtocol => {
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
  const accountDbRepositoryStub = makeAccountDbRepositoryStub()
  const sut = new ValidateActiveAccount(accountDbRepositoryStub)

  return { sut, accountDbRepositoryStub, fakeUser }
}
