import { ILogError } from '@/domain'

export interface ICreateLogErrorRepository {
  /**
   * @async Asynchronous method.
   * @description Receive a error and create a log based on it.
   * @param error Error that will serve the necessary data to create a log.
   * @returns Return a log.
   */
  create: (error: Error) => ILogError
}
