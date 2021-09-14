import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelper } from '@/presentation/helpers/http-helper'
import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeControllerStub } from '@/tests/__mocks__/presentation/controllers/mock-controller'
import { makeLogErrorDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/log/mock-log-error-db-repository'

const httpHelper = makeHttpHelper()

interface SutTypes {
  sut: LogControllerDecorator
  error: Error
  controllerStub: ControllerProtocol
  httpHelper: HttpHelper
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const controllerStub = makeControllerStub()
  const logErrorDbRepositoryStub = makeLogErrorDbRepositoryStub(error)
  const sut = new LogControllerDecorator(controllerStub, logErrorDbRepositoryStub)

  return { sut, error, controllerStub, httpHelper, logErrorDbRepositoryStub }
}
