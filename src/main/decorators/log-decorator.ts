import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

type LogDecoratorProtocol = ControllerProtocol | MiddlewareProtocol
export class LogDecorator<T extends LogDecoratorProtocol> {
  constructor (
    private readonly fn: T,
    private readonly logErrorDbRepository: LogErrorDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.fn.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorDbRepository.saveLog(httpResponse.data.error)
    }
    return httpResponse
  }
}
