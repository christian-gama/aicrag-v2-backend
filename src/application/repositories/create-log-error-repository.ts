import { ILogError } from '@/domain'
import { CreateLogErrorRepositoryProtocol } from '@/domain/repositories'

export class CreateLogErrorRepository implements CreateLogErrorRepositoryProtocol {
  createLog (error: Error): ILogError {
    return {
      date: new Date(Date.now()).toLocaleString(),
      message: error.message,
      name: error.name,
      stack: error.stack
    }
  }
}
