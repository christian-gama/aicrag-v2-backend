import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { makeHttpHelper } from '@/factories/helpers'

export const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return makeHttpHelper().ok({})
    }
  }

  return new ControllerStub()
}
