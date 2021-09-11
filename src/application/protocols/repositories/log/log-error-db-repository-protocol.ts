import { LogErrorProtocol } from '@/domain/log/log-error-protocol'

export interface LogErrorDbRepositoryProtocol {
  saveLog: (log: LogErrorProtocol) => Promise<void>
}
