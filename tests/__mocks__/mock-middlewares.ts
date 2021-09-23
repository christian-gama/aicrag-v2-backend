import { makeHttpHelper } from '@/main/factories/helpers'
import { HttpRequestToken, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

const httpHelper = makeHttpHelper()
export const makeMiddlewareStub = (): MiddlewareProtocol => {
  class MiddlewareStub implements MiddlewareProtocol {
    async handle (httpRequest: HttpRequestToken): Promise<HttpResponse> {
      return Promise.resolve(httpHelper.ok({}))
    }
  }

  return new MiddlewareStub()
}
