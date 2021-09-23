import { IUser } from '@/domain'
import { IRefreshToken, VerifyTokenProtocol } from '@/application/protocols/providers'
import { DecoderProtocol, EncrypterProtocol } from '@/application/protocols/cryptography'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { RefreshToken } from '@/presentation/middlewares/authentication/refresh-token/'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import {
  makeJwtAdapterStub
} from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'
import { makeVerifyTokenStub } from '@/tests/__mocks__/infra/providers/mock-verify-token'
interface SutTypes {
  sut: RefreshToken
  fakeRefreshToken: IRefreshToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  jwtAccessToken: EncrypterProtocol & DecoderProtocol
  request: HttpRequestToken
  verifyRefreshTokenStub: VerifyTokenProtocol
}

export const makeSut = (): SutTypes => {
  const fakeRefreshToken = makeFakeRefreshToken()
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAdapterStub()
  const verifyRefreshTokenStub = makeVerifyTokenStub()
  const request: HttpRequestToken = { refreshToken: 'any_token' }

  const sut = new RefreshToken(httpHelper, jwtAccessToken, verifyRefreshTokenStub)

  return {
    sut,
    fakeRefreshToken,
    fakeUser,
    httpHelper,
    jwtAccessToken,
    verifyRefreshTokenStub,
    request
  }
}
