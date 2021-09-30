import { ILogError } from '@/domain'
import { LogErrorRepositoryProtocol } from '@/domain/repositories'

export class LogErrorRepository implements LogErrorRepositoryProtocol {
  createLog (error: Error): ILogError {
    return {
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      name: error.name,
      stack: error.stack
    }
  }
}
