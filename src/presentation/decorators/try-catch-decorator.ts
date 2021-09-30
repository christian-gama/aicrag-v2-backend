import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeHttpHelper } from '../../factories/helpers'

export class TryCatchDecorator<T extends ControllerProtocol | MiddlewareProtocol> {
  constructor (private readonly fn: T) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse = await this.fn.handle(httpRequest)

      return httpResponse
    } catch (error) {
      const httpHelper = makeHttpHelper()

      return httpHelper.serverError(error)
    }
  }
}
