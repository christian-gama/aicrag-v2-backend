import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { User, UserAccount } from '@/domain/user'
import { SignUpController } from '@/presentation/controllers/signup/signup-controllers'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountDbRepositoryStub = (): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(makeFakeUser())
    }
  }

  return new AccountDbRepositoryStub()
}

const makeAccountValidatorStub = (): AccountValidatorProtocol => {
  class AccountValidatorStub implements AccountValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new AccountValidatorStub()
}

export interface SutTypes {
  sut: SignUpController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  accountValidatorStub: AccountValidatorProtocol
}

export const makeSut = (): SutTypes => {
  const accountDbRepositoryStub = makeAccountDbRepositoryStub()
  const accountValidatorStub = makeAccountValidatorStub()
  const sut = new SignUpController(accountDbRepositoryStub, accountValidatorStub)

  return { sut, accountDbRepositoryStub, accountValidatorStub }
}
