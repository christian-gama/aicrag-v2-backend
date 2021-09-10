import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User, UserAccount } from '@/domain/user'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

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

const makeJwtAdapterStub = (): EncrypterProtocol => {
  class JwtAdapterStub implements EncrypterProtocol {
    encryptId (id: string): string {
      return 'any_token'
    }
  }

  return new JwtAdapterStub()
}

const makeCredentialsValidatorStub = (): ValidatorProtocol => {
  class CredentialsValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new CredentialsValidatorStub()
}

export interface SutTypes {
  sut: LoginController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  credentialsValidatorStub: ValidatorProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
  fakeUser: User
  jwtAdapterStub: EncrypterProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const credentialsValidatorStub = makeCredentialsValidatorStub()
  const httpHelper = new HttpHelper()
  const jwtAdapterStub = makeJwtAdapterStub()
  const request = {
    body: {
      email: fakeUser.personal.email,
      password: fakeUser.personal.password
    }
  }
  const sut = new LoginController(accountDbRepositoryStub, credentialsValidatorStub, httpHelper, jwtAdapterStub)

  return { sut, accountDbRepositoryStub, credentialsValidatorStub, httpHelper, request, fakeUser, jwtAdapterStub }
}
