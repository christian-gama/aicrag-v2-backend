import { ComparerProtocol } from '@/application/protocols/cryptography/'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User, UserAccount } from '@/domain/user'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { ValidateCredentials } from '@/application/usecases/validators/credentials/validate-credentials'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'

const fakeUser = makeFakeUser()

const makeComparerStub = (): ComparerProtocol => {
  class ComparerStub implements ComparerProtocol {
    async compare (value: string, valueToCompare: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }

  return new ComparerStub()
}

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
  comparerStub: ComparerProtocol
  fakeUser: User
}

export const makeSut = (): SutTypes => {
  const accountDbRepositoryStub = makeAccountDbRepositoryStub()
  const comparerStub = makeComparerStub()
  const sut = new ValidateCredentials(accountDbRepositoryStub, comparerStub)

  return { sut, accountDbRepositoryStub, comparerStub, fakeUser }
}
