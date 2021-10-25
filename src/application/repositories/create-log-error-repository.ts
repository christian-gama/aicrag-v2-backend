import { ILogError } from '@/domain'
import { ICreateLogErrorRepository } from '@/domain/repositories'

export class CreateLogErrorRepository implements ICreateLogErrorRepository {
  createLog (error: Error): ILogError {
    const result: ILogError = {
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      name: error.name,
      stack: error.stack
    }

    return result
  }
}
