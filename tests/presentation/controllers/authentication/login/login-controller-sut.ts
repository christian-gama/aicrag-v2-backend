import { PublicUser, User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelper } from '@/presentation/helpers/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { LoginController } from '@/presentation/controllers/authentication/login/login-controller'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeEncrypterStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'

export interface SutTypes {
  sut: LoginController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  credentialsValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  encrypterStub: EncrypterProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const credentialsValidatorStub = makeValidatorStub()
  const httpHelper = new HttpHelper()
  const encrypterStub = makeEncrypterStub()
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
    encrypterStub
  )

  return {
    sut,
    accountDbRepositoryStub,
    credentialsValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    encrypterStub,
    request
  }
}
