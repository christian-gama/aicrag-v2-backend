import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeHttpHelper } from '@/factories/helpers'

const httpHelper = makeHttpHelper()
export const makeMiddlewareStub = (): MiddlewareProtocol => {
  class MiddlewareStub implements MiddlewareProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(httpHelper.ok({}))
    }
  }

  return new MiddlewareStub()
}
