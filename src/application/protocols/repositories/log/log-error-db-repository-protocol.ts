import { ILogError } from '@/domain/log/log-error-protocol'

export interface LogErrorDbRepositoryProtocol {
  saveLog: (log: ILogError) => Promise<ILogError>
}
