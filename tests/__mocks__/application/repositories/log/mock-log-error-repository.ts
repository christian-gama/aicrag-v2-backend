import { LogError } from '@/domain/log/log-error-protocol'
import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-repository-protocol'

export const makeLogErrorRepositoryStub = (fakeLogError: LogError): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    createLog (_error: Error): LogError {
      return fakeLogError
    }
  }

  return new LogErrorRepositoryStub()
}
