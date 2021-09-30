import { ILogError } from '@/domain'

export interface LogErrorRepositoryProtocol {
  createLog: (error: Error) => ILogError
}
