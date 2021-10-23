import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeHttpHelper } from '../../factories/helpers'

export class TryCatchDecorator<T extends IController | IMiddleware> {
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
