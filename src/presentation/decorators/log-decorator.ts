import { LogErrorRepositoryProtocol } from '@/domain/repositories'

import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

type LogDecoratorProtocol = ControllerProtocol | MiddlewareProtocol
export class LogDecorator<T extends LogDecoratorProtocol> {
  constructor (
    private readonly fn: T,
    private readonly logErrorRepository: LogErrorRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.fn.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorRepository.saveLog(httpResponse.data.error)
    }
    return httpResponse
  }
}
