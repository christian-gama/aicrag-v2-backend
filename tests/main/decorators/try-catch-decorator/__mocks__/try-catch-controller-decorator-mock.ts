import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { HttpHelper } from '@/presentation/helper/http-helper'
import { HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'
import { TryCatchControllerDecorator } from '@/main/decorators/try-catch-controller-decorator'

const httpHelper = makeHttpHelper()

const makeControllerStub = (): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return httpHelper.ok({})
    }
  }

  return new ControllerStub()
}

interface SutTypes {
  sut: TryCatchControllerDecorator
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
}

export const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const sut = new TryCatchControllerDecorator(controllerStub)

  return { sut, controllerStub, httpHelper }
}
