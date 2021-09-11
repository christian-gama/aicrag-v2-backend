import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { LogErrorRepository } from '@/application/usecases/repositories/log/log-error-repository'

export class LogErrorDbRepository implements LogErrorDbRepositoryProtocol {
  constructor (private readonly logErrorRepository: LogErrorRepository) {}

  async saveLog (error: Error): Promise<void> {
    this.logErrorRepository.createLog(error)
  }
}
