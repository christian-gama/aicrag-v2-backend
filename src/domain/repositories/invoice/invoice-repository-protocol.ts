import { ITask } from '@/domain'

import { QueryProtocol, QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'

export interface TaskRepositoryProtocol extends GetInvoiceByMonthProtocol {}

export interface GetInvoiceByMonthProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param data Object than contains month, taskId (optional), userId and year.
   * @param query Query that will refine the final result of the search.
   * @returns Return an array of tasks if finds it or an empty array if does not.
   */
  getInvoiceByMonth: <T extends ITask>(
    data: {
      month: number
      taskId?: string
      userId: string
      year: number
    },
    query: QueryProtocol
  ) => Promise<QueryResultProtocol<T>>
}
