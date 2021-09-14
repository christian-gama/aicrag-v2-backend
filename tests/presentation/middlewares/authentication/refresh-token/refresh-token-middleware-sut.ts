import { DecoderProtocol } from '@/application/protocols/cryptography/decoder-protocol'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { HttpHelperProtocol, HttpRequestToken } from '@/presentation/helpers/http/protocols'
import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token/'
import { makeDecoderStub } from '@/tests/__mocks__/infra/adapters/cryptography/mock-jwt-adapter'

interface SutTypes {
  sut: RefreshTokenMiddleware
  decoder: DecoderProtocol
  request: HttpRequestToken
  httpHelper: HttpHelperProtocol
}

export const makeSut = (): SutTypes => {
  const decoder = makeDecoderStub()
  const httpHelper = makeHttpHelper()
  const request: HttpRequestToken = {
    token: 'any_token'
  }
  const sut = new RefreshTokenMiddleware(decoder, httpHelper)

  return { sut, decoder, httpHelper, request }
}
