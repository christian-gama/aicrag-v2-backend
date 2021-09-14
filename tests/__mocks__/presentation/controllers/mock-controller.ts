import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'

export const makeControllerStub = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeHttpHelper().ok({})
    }
  }

  return new ControllerStub()
}
