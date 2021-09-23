import { ILogError } from '@/domain'

export interface LogErrorDbRepositoryProtocol {
  saveLog: (log: ILogError) => Promise<ILogError>
}
