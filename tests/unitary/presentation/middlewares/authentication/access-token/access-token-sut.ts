import { IUser } from '@/domain/user/index'
import { VerifyTokenProtocol } from '@/application/protocols/providers/verify-token-protocol'
import { AccessToken } from '@/presentation/middlewares/authentication/access-token/'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeVerifyTokenStub } from '@/tests/__mocks__/infra/providers/mock-verify-token'
import { makeFakeUser } from '@/tests/__mocks__/domain/mock-user'

interface SutTypes {
  sut: AccessToken
  fakeUser: IUser
  httpHelper: HttpHelperProtocol
  request: HttpRequestToken
  verifyAccessTokenStub: VerifyTokenProtocol
}

export const makeSut = (): SutTypes => {
  const fakeUser = makeFakeUser()
  const httpHelper = makeHttpHelper()
  const request = { accessToken: 'any_token' }
  const verifyAccessTokenStub = makeVerifyTokenStub()

  const sut = new AccessToken(httpHelper, verifyAccessTokenStub)

  return {
    sut,
    fakeUser,
    httpHelper,
    request,
    verifyAccessTokenStub
  }
}
