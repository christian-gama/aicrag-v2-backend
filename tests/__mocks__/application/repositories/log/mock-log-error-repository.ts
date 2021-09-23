import { ILogError } from '@/domain'
import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories'

export const makeLogErrorRepositoryStub = (fakeLogError: ILogError): LogErrorRepositoryProtocol => {
  class LogErrorRepositoryStub implements LogErrorRepositoryProtocol {
    createLog (_error: Error): ILogError {
      return fakeLogError
    }
  }

  return new LogErrorRepositoryStub()
}
