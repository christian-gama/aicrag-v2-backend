import { PublicUser, User, UserAccount } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelper } from '@/presentation/helper/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helper/http/protocols'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { makeFakePublicUser } from '@/tests/domain/__mocks__/public-user-mock'
import { makeFakeUser } from '@/tests/domain/__mocks__/user-mock'

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

const makeCredentialsValidatorStub = (): ValidatorProtocol => {
  class CredentialsValidatorStub implements ValidatorProtocol {
    validate (input: any): Error | undefined {
      return undefined
    }
  }

  return new CredentialsValidatorStub()
}

const makeFilterUserDataStub = (fakeUser: User): FilterUserDataProtocol => {
  class FilterUserDataStub implements FilterUserDataProtocol {
    filter (user: User): PublicUser {
      return makeFakePublicUser(fakeUser)
    }
  }

  return new FilterUserDataStub()
}

const makeJwtAdapterStub = (): EncrypterProtocol => {
  class JwtAdapterStub implements EncrypterProtocol {
    encryptId (id: string): string {
      return 'any_token'
    }
  }

  return new JwtAdapterStub()
}

export interface SutTypes {
  sut: LoginController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  credentialsValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  jwtAdapterStub: EncrypterProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const credentialsValidatorStub = makeCredentialsValidatorStub()
  const httpHelper = new HttpHelper()
  const jwtAdapterStub = makeJwtAdapterStub()
  const request = {
    body: {
      email: fakeUser.personal.email,
      password: fakeUser.personal.password
    }
  }
  const sut = new LoginController(
    accountDbRepositoryStub,
    credentialsValidatorStub,
    filterUserDataStub,
    httpHelper,
    jwtAdapterStub
  )

  return {
    sut,
    accountDbRepositoryStub,
    credentialsValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    jwtAdapterStub,
    request
  }
}
