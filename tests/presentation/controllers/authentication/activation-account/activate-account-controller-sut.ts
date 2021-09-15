import { PublicUser, User } from '@/domain/user'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ActivateAccountController } from '@/presentation/controllers/authentication/activate-account/activate-account-controller'
import { HttpHelperProtocol, HttpRequest } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeEncrypterStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakePublicUser } from '@/tests/__mocks__/domain/mock-public-user'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeFilterUserDataStub } from '@/tests/__mocks__/application/helpers/mock-filter-user-data'
import { makeRefreshTokenDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/refresh-token/mock-refresh-token-db-repository'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { makeValidatorStub } from '@/tests/__mocks__/application/validators/mock-validator'

export interface SutTypes {
  sut: ActivateAccountController
  activateAccountValidatorStub: ValidatorProtocol
  fakePublicUser: PublicUser
  fakeUser: User
  filterUserDataStub: FilterUserDataProtocol
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol
  jwtRefreshToken: EncrypterProtocol
  refreshTokenDbRepositoryStub: RefreshTokenDbRepositoryProtocol
  request: HttpRequest
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const activateAccountValidatorStub = makeValidatorStub()
  const fakeUser = makeFakeUser()
  const fakePublicUser = makeFakePublicUser(fakeUser)
  const filterUserDataStub = makeFilterUserDataStub(fakeUser)
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeEncrypterStub()
  const jwtRefreshToken = makeEncrypterStub()
  const refreshTokenDbRepositoryStub = makeRefreshTokenDbRepositoryStub()
  const request = {
    body: { email: fakeUser.personal.email, activationCode: fakeUser.temporary.activationCode }
  }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new ActivateAccountController(
    activateAccountValidatorStub,
    filterUserDataStub,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub,
    userDbRepositoryStub
  )

  return {
    sut,
    activateAccountValidatorStub,
    fakePublicUser,
    fakeUser,
    filterUserDataStub,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub,
    request,
    userDbRepositoryStub
  }
}
