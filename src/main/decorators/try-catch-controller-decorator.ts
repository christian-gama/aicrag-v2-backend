import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '../factories/helpers'

export class TryCatchControllerDecorator implements ControllerProtocol {
  constructor (private readonly controller: ControllerProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const httpResponse = await this.controller.handle(httpRequest)

      return httpResponse
    } catch (error) {
      const httpHelper = makeHttpHelper()

      return httpHelper.serverError(error)
    }
  }
}
