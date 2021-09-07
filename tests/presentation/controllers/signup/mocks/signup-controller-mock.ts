import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { User, UserAccount } from '@/domain/user'
import { SignUpController } from '@/presentation/controllers/signup/signup-controllers'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'

const makeAccountDbRepositoryStub = (fakeUser: User): AccountDbRepositoryProtocol => {
  class AccountDbRepositoryStub implements AccountDbRepositoryProtocol {
    async saveAccount (account: UserAccount): Promise<User> {
      return Promise.resolve(fakeUser)
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
  fakeUser: User
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const accountValidatorStub = makeAccountValidatorStub()
  const httpHelper = new HttpHelper()
  const request = {
    body: {
      name: fakeUser.personal.name,
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const sut = new SignUpController(accountDbRepositoryStub, accountValidatorStub, httpHelper)

  return { sut, accountDbRepositoryStub, accountValidatorStub, fakeUser, httpHelper, request }
}
