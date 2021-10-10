import { ILogError } from '@/domain'
import { LogErrorDbRepositoryProtocol } from '@/domain/repositories'

import { CreateLogErrorRepository } from '@/application/repositories'

import { DatabaseProtocol } from '../protocols'

export class LogErrorDbRepository implements LogErrorDbRepositoryProtocol {
  constructor (
    private readonly createLogErrorRepository: CreateLogErrorRepository,
    private readonly database: DatabaseProtocol
  ) {}

  async saveLog (error: Error): Promise<ILogError> {
    const log = this.createLogErrorRepository.createLog(error)

    const logCollection = this.database.collection('logs')

    return await logCollection.insertOne(log)
  }
}
