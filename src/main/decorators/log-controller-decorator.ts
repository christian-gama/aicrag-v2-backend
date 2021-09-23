import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

export class LogControllerDecorator implements ControllerProtocol {
  constructor (
    private readonly controller: ControllerProtocol,
    private readonly logErrorDbRepository: LogErrorDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)

    if (httpResponse.statusCode === 500) {
      await this.logErrorDbRepository.saveLog(httpResponse.data.error)
    }

    return httpResponse
  }
}
