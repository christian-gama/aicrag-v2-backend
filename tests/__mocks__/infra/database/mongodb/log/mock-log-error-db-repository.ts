import { LogError } from '@/domain/log/log-error-protocol'
import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { makeFakeLogError } from '@/tests/__mocks__/domain/mock-log-error'

export const makeLogErrorDbRepositoryStub = (error: Error): LogErrorDbRepositoryProtocol => {
  class LogErrorDbRepositoryStub implements LogErrorDbRepositoryProtocol {
    async saveLog (_error: Error): Promise<LogError> {
      return makeFakeLogError(error)
    }
  }

  return new LogErrorDbRepositoryStub()
}
