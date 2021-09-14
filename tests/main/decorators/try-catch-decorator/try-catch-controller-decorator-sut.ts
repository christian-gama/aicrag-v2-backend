import { ControllerProtocol } from '@/presentation/controllers/authentication/login'
import { HttpHelper } from '@/presentation/helpers/http-helper'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { TryCatchControllerDecorator } from '@/main/decorators/try-catch-controller-decorator'
import { makeControllerStub } from '@/tests/__mocks__/presentation/controllers/mock-controller'

interface SutTypes {
  sut: TryCatchControllerDecorator
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
}

export const makeSut = (): SutTypes => {
  const httpHelper = makeHttpHelper()
  const controllerStub = makeControllerStub()
  const sut = new TryCatchControllerDecorator(controllerStub)

  return { sut, controllerStub, httpHelper }
}
