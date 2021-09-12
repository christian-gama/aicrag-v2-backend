import { ControllerProtocol } from '@/presentation/controllers/login'
import { HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'

export const error = new Error('any_message')
export const makeControllerStub = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      throw error
    }
  }

  return new ControllerStub()
}
