import { IController } from '@/presentation/controllers/protocols/controller.model'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { makeHttpHelper } from '@/main/factories/helpers'

export const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeHttpHelper().ok({})
    }
  }

  return new ControllerStub()
}
