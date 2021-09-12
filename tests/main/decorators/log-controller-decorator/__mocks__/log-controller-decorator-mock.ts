import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'
import { HttpHelper } from '@/presentation/helper/http-helper'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeFakeLogError } from '@/tests/domain/__mocks__/log-error-mock'
import { LogErrorProtocol } from '@/domain/log/log-error-protocol'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'

const httpHelper = makeHttpHelper()

const makeControllerStub = (error: Error): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return httpHelper.serverError(error)
    }
  }

  return new ControllerStub()
}

const makeLogErrorRepositoryStub = (error: Error): LogErrorDbRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorDbRepositoryProtocol {
    async saveLog (_error: Error): Promise<LogErrorProtocol> {
      return makeFakeLogError(error)
    }
  }

  return new LogErrorRepositoryStub()
}

interface SutTypes {
  sut: LogControllerDecorator
  error: Error
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const controllerStub = makeControllerStub(error)
  const logErrorDbRepositoryStub = makeLogErrorRepositoryStub(error)
  const sut = new LogControllerDecorator(controllerStub, logErrorDbRepositoryStub)

  return { sut, error, controllerStub, httpHelper, logErrorDbRepositoryStub }
}
