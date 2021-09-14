import { PublicUser, User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { SignUpController } from '@/presentation/controllers/authentication/signup/signup-controller'
import { makeAccountDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/account/mock-account-db-repository'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'

export interface SutTypes {
  sut: SignUpController
  accountDbRepositoryStub: AccountDbRepositoryProtocol
  accountValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  request: HttpRequest
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const accountDbRepositoryStub = makeAccountDbRepositoryStub(fakeUser)
  const accountValidatorStub = makeValidatorStub()
  const httpHelper = makeHttpHelper()
  const request = {
    body: {
      name: fakeUser.personal.name,
      email: fakeUser.personal.email,
      password: fakeUser.personal.password,
      passwordConfirmation: fakeUser.personal.password
    }
  }
  const sut = new SignUpController(
    accountDbRepositoryStub,
    accountValidatorStub,
    filterUserDataStub,
    httpHelper
  )

  return {
    sut,
    accountDbRepositoryStub,
    accountValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    request
  }
}
