import { User } from '@/domain/user/'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token/'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import {
  makeDecoderStub,
  makeEncrypterStub
} from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeRefreshTokenDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/refresh-token/mock-refresh-token-db-repository'
import { makeComparerStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-bcrypt-adapter'
import { ComparerProtocol } from '@/application/protocols/cryptography'
import { makeUserDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/user/mock-user-db-repository'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
interface SutTypes {
  sut: RefreshTokenMiddleware
  fakeRefreshToken: RefreshToken
  fakeUser: User
  comparerStub: ComparerProtocol
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol
  jwtRefreshToken: DecoderProtocol
  refreshTokenDbRepositoryStub: RefreshTokenDbRepositoryProtocol
  request: HttpRequestToken
  userDbRepositoryStub: UserDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const comparerStub = makeComparerStub()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeEncrypterStub()
  const jwtRefreshToken = makeDecoderStub()
  const refreshTokenDbRepositoryStub = makeRefreshTokenDbRepositoryStub()
  const request: HttpRequestToken = { refreshToken: 'any_token' }
  const userDbRepositoryStub = makeUserDbRepositoryStub(fakeUser)

  const sut = new RefreshTokenMiddleware(
    comparerStub,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub,
    userDbRepositoryStub
  )

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    comparerStub,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub,
    request,
    userDbRepositoryStub
  }
}
