import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token/'

interface SutTypes {
  sut: RefreshTokenMiddleware
  request: HttpRequestToken
  httpHelper: HttpHelperProtocol
}

export const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const request: HttpRequestToken = {
    token: 'any_token'
  }
  const sut = new RefreshTokenMiddleware(httpHelper)

  return { sut, httpHelper, request }
}
