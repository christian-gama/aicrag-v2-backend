import { ILogError } from '@/domain'
import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'
import { makeFakeLogError } from '@/tests/__mocks__/domain/mock-log-error'

export const makeLogErrorDbRepositoryStub = (error: Error): LogErrorDbRepositoryProtocol => {
  class LogErrorDbRepositoryStub implements LogErrorDbRepositoryProtocol {
    async saveLog (_error: Error): Promise<ILogError> {
      return makeFakeLogError(error)
    }
  }

  return new LogErrorDbRepositoryStub()
}
