import { ILogError } from '@/domain'

export interface ILogErrorRepository {
  /**
   * @async Asynchronous method.
   * @description Receive a log error and save it.
   * @param log The log that will be saved.
   * @returns Return a log after saving it.
   */
  save: (log: ILogError) => Promise<ILogError>
}
