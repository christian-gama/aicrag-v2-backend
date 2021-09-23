import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'
import { makeLogErrorDbRepositoryStub } from '@/tests/__mocks__/infra/database/mongodb/log/mock-log-error-db-repository'

interface SutTypes {
  sut: ClearUserDatabase
  error: Error
  logErrorDbRepositoryStub: LogErrorDbRepositoryProtocol
}

export const makeSut = (): SutTypes => {
  const error = new Error('any_message')
  const logErrorDbRepositoryStub = makeLogErrorDbRepositoryStub(error)
  const sut = new ClearUserDatabase(logErrorDbRepositoryStub)

  return { sut, error, logErrorDbRepositoryStub }
}
