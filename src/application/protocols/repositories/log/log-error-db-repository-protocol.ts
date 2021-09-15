import { LogError } from '@/domain/log/log-error-protocol'

export interface LogErrorDbRepositoryProtocol {
  saveLog: (log: LogError) => Promise<LogError>
}
