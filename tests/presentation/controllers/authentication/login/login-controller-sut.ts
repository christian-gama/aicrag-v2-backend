import { PublicUser, User } from '@/domain/user'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelper } from '@/presentation/helpers/http-helper'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { LoginController } from '@/presentation/controllers/authentication/login/login-controller'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'
import { makeGenerateTokenStub } from '@/tests/__mocks__/infra/providers/mock-generate-token'
export interface SutTypes {
  sut: LoginController
  credentialsValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  generateAccessTokenStub: GenerateTokenProtocol
  generateRefreshTokenStub: GenerateTokenProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const credentialsValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const httpHelper = new HttpHelper()
  const generateAccessTokenStub = makeGenerateTokenStub()
  const generateRefreshTokenStub = makeGenerateTokenStub()
  const request = { body: { email: fakeUser.personal.email, password: fakeUser.personal.password } }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new LoginController(
    credentialsValidatorStub,
    filterUserDataStub,
    httpHelper,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    userDbRepositoryStub
  )

  return {
    sut,
    credentialsValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    generateAccessTokenStub,
    generateRefreshTokenStub,
    request,
    userDbRepositoryStub
  }
}
