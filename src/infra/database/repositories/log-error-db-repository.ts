import { ILogError } from '@/domain'

import { LogErrorDbRepositoryProtocol } from '@/application/protocols/repositories'
import { LogErrorRepository } from '@/application/usecases/repositories'

import { MongoAdapter } from '../../adapters/database'

export class LogErrorDbRepository implements LogErrorDbRepositoryProtocol {
  constructor (private readonly logErrorRepository: LogErrorRepository) {}

  async saveLog (error: Error): Promise<ILogError> {
    const log = this.logErrorRepository.createLog(error)

    const logCollection = MongoAdapter.getCollection('logs')

    const insertedResult = await logCollection.insertOne(log)

    return (await logCollection.findOne({ _id: insertedResult.insertedId })) as ILogError
  }
}
