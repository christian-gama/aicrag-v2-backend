import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'
import { makeHttpHelper } from '@/main/factories/helpers'

const httpHelper = makeHttpHelper()
export const makeMiddlewareStub = (): IMiddleware => {
  class MiddlewareStub implements IMiddleware {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return await Promise.resolve(httpHelper.ok({}))
    }
  }

  return new MiddlewareStub()
}
