import { LogErrorProtocol } from '@/domain/log/log-error-protocol'

export interface LogErrorRepositoryProtocol {
  createError: (error: Error) => LogErrorProtocol
}
