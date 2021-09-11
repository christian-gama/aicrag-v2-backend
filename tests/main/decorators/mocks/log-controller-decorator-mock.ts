import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { HttpHelper } from '@/presentation/http/helper/http-helper'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeFakeLogError } from '@/tests/domain/log/log-error-mock'
import { LogErrorProtocol } from '@/domain/log/log-error-protocol'

const makeControllerStub = (error: Error): ControllerProtocol => {
  class ControllerStub implements ControllerProtocol {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new HttpHelper().serverError(error)
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
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const controllerStub = makeControllerStub(error)
  const logErrorDbRepositoryStub = makeLogErrorRepositoryStub(error)
  const sut = new LogControllerDecorator(controllerStub, logErrorDbRepositoryStub)

  return { sut, error, controllerStub, logErrorDbRepositoryStub }
}
