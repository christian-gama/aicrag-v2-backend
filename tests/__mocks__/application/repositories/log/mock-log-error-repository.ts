import { LogErrorProtocol } from '@/domain/log/log-error-protocol'
import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-repository-protocol'

export const makeLogErrorRepositoryStub = (fakeLogError: LogErrorProtocol): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    createLog (_error: Error): LogErrorProtocol {
      return fakeLogError
    }
  }

  return new LogErrorRepositoryStub()
}
