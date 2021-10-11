import { ITask } from '@/domain'

import { QueryProtocol, QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'

export interface InvoiceRepositoryProtocol extends GetInvoiceByMonthProtocol {}

export interface QueryInvoiceProtocol extends QueryProtocol {
  month: string
  year: string
  taskId?: string
}

export interface QueryAllInvoicesProtocol extends QueryProtocol {
  type: 'QA' | 'TX' | { $ne: null }
}

export interface GetInvoiceByMonthProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param userId User id that belongs to the task.
   * @param query Query that will refine the final result of the search.
   * @returns Return an array of tasks if finds it or an empty array if does not.
   */
  getInvoiceByMonth: <T extends ITask>(
    query: QueryInvoiceProtocol,
    userId: string
  ) => Promise<QueryResultProtocol<T>>
}
