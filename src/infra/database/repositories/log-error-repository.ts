import { ILogError } from '@/domain'
import { LogErrorRepositoryProtocol } from '@/domain/repositories'

import { CreateLogErrorRepository } from '@/application/repositories'

import { DatabaseProtocol } from '../protocols'

export class LogErrorRepository implements LogErrorRepositoryProtocol {
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
