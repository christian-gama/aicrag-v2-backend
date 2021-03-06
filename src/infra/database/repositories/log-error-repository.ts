import { ILogError } from '@/domain'
import { ILogErrorRepository } from '@/domain/repositories'
import { CreateLogErrorRepository } from '@/application/repositories'
import { IDatabase } from '../protocols'

export class LogErrorRepository implements ILogErrorRepository {
  constructor (
    private readonly createLogErrorRepository: CreateLogErrorRepository,
    private readonly database: IDatabase
  ) {}

  async save (error: Error): Promise<ILogError> {
    const log = this.createLogErrorRepository.create(error)

    const logCollection = this.database.collection('logs')

    const result = await logCollection.insertOne(log)

    return result as ILogError
  }
}
