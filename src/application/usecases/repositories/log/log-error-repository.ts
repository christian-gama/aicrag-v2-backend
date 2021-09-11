import { LogErrorProtocol } from '@/domain/log/log-error-protocol'
import { LogErrorRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-repository-protocol'

export class LogErrorRepository implements LogErrorRepositoryProtocol {
  createLog (error: Error): LogErrorProtocol {
    return {
      name: error.name,
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      stack: error.stack
    }
  }
}
