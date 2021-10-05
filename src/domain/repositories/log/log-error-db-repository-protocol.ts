import { ILogError } from '@/domain'

export interface LogErrorDbRepositoryProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a log error and save it.
   * @param log The log that will be saved.
   * @returns Return a log after saving it.
   */
  saveLog: (log: ILogError) => Promise<ILogError>
}
