import { ILogError } from '@/domain/log/log-error-protocol'

export interface LogErrorRepositoryProtocol {
  createLog: (error: Error) => ILogError
}
