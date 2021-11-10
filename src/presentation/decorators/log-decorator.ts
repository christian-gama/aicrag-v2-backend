import { ILogErrorRepository } from '@/domain/repositories'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'

type LogDecoratorProtocol = IController | IMiddleware
export class LogDecorator<T extends LogDecoratorProtocol> {
  constructor (private readonly fn: T, private readonly logErrorRepository: ILogErrorRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const result = await this.fn.handle(httpRequest)

    if (result.statusCode === 500) {
      await this.logErrorRepository.save(result.data.error)
    }

    return result
  }
}
