import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeHttpHelper } from '@/main/factories/helpers'

const httpHelper = makeHttpHelper()
export const makeMiddlewareStub = (): MiddlewareProtocol => {
  class MiddlewareStub implements MiddlewareProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return Promise.resolve(httpHelper.ok({}))
    }
  }

  return new MiddlewareStub()
}
