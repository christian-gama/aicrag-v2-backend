import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-repository-protocol'
import { LogErrorProtocol } from '@/domain/log/log-error-protocol'
import { LogErrorDbRepository } from '@/infra/database/mongodb/log/log-error-db-repository'
import { makeFakeLogError } from '@/tests/__mocks__/domain/mock-log-error'
import { makeLogErrorRepositoryStub } from '@/tests/__mocks__/application/repositories/log/mock-log-error-repository'

interface SutTypes {
  sut: LogErrorDbRepository
  error: Error
  fakeLogError: LogErrorProtocol
  logErrorRepositoryStub: LogErrorRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const error = new Error('any_error')
  const fakeLogError = makeFakeLogError(error)
  const logErrorRepositoryStub = makeLogErrorRepositoryStub(fakeLogError)
  const sut = new LogErrorDbRepository(logErrorRepositoryStub)

  return { sut, error, fakeLogError, logErrorRepositoryStub }
}
