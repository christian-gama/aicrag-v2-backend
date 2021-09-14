import { User } from '@/domain/user/'
import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token/'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import {
  makeDecoderStub,
  makeEncrypterStub
} from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeRefreshTokenDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/refresh-token/mock-refresh-token-db-repository'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'

interface SutTypes {
  sut: RefreshTokenMiddleware
  decoder: DecoderProtocol
  encrypter: EncrypterProtocol
  fakeRefreshToken: RefreshToken
  fakeUser: User
  httpHelper: HttpHelperProtocol
  refreshTokenDbRepositoryStub: RefreshTokenDbRepositoryProtocol
  request: HttpRequestToken
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const decoder = makeDecoderStub()
  const encrypter = makeEncrypterStub()
  const refreshTokenDbRepositoryStub = makeRefreshTokenDbRepositoryStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequestToken = {
    token: 'any_token'
  }
  const sut = new RefreshTokenMiddleware(
    decoder,
    encrypter,
    httpHelper,
    refreshTokenDbRepositoryStub
  )

  return {
    sut,
    decoder,
    encrypter,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    refreshTokenDbRepositoryStub,
    request
  }
}
