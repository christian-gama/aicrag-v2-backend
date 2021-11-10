import { IController } from '@/presentation/controllers/protocols/controller.model'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'
import { makeHttpHelper } from '../../main/factories/helpers'

export class TryCatchDecorator<T extends IController | IMiddleware> {
  constructor (private readonly fn: T) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.fn.handle(httpRequest)

      return result
    } catch (error) {
      const result = makeHttpHelper().serverError(error)

      return result
    }
  }
}
