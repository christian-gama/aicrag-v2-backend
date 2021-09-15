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
interface SutTypes {
  sut: RefreshTokenMiddleware
  fakeRefreshToken: RefreshToken
  fakeUser: User
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol
  jwtRefreshToken: DecoderProtocol
  refreshTokenDbRepositoryStub: RefreshTokenDbRepositoryProtocol
  request: HttpRequestToken
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeEncrypterStub()
  const jwtRefreshToken = makeDecoderStub()
  const refreshTokenDbRepositoryStub = makeRefreshTokenDbRepositoryStub()
  const request: HttpRequestToken = { refreshToken: 'any_token' }

  const sut = new RefreshTokenMiddleware(
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub
  )

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    jwtAccessToken,
    jwtRefreshToken,
    refreshTokenDbRepositoryStub,
    request
  }
}
