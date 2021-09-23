import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories'
import { ILogError } from '@/domain'

export class LogErrorRepository implements LogErrorRepositoryProtocol {
  createLog (error: Error): ILogError {
    return {
      name: error.name,
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      stack: error.stack
    }
  }
}
