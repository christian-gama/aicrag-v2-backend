import { ILogError } from '@/domain/log/log-error-protocol'
import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories/log/log-error-db-repository-protocol'
import { LogErrorRepository } from '@/application/usecases/repositories/log/log-error-repository'
import { MongoHelper } from '../helper/mongo-helper'

export class LogErrorDbRepository implements LogErrorDbRepositoryProtocol {
  constructor (private readonly logErrorRepository: LogErrorRepository) {}

  async saveLog (error: Error): Promise<ILogError> {
    const log = this.logErrorRepository.createLog(error)

    const logCollection = MongoHelper.getCollection('logs')

    const insertedResult = await logCollection.insertOne(log)

    return (await logCollection.findOne({ _id: insertedResult.insertedId })) as ILogError
  }
}
