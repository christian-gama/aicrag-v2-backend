import { ILogError } from '@/domain'
import { LogErrorDbRepositoryProtocol } from '@/domain/repositories'

import { LogErrorRepository } from '@/application/repositories'

import { DatabaseProtocol } from '../protocols'

export class LogErrorDbRepository implements LogErrorDbRepositoryProtocol {
  constructor (
    private readonly database: DatabaseProtocol,
    private readonly logErrorRepository: LogErrorRepository
  ) {}

  async saveLog (error: Error): Promise<ILogError> {
    const log = this.logErrorRepository.createLog(error)

    const logCollection = this.database.collection('logs')

    return await logCollection.insertOne(log)
  }
}
