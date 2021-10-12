import { ITask } from '@/domain'

import { QueryProtocol, QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'

export interface InvoiceRepositoryProtocol
  extends GetAllInvoicesProtocol,
  GetInvoiceByMonthProtocol {}

export interface QueryInvoiceProtocol extends QueryProtocol {
  month: string
  year: string
  taskId?: string
  type: string
}

export interface QueryAllInvoicesProtocol extends QueryProtocol {
  type: 'QA' | 'TX' | { $ne: null }
}

export interface AllInvoicesDocument {
  date: {
    month: number
    year: number
  }
  tasks: number
  totalUsd: number
}

export interface GetAllInvoicesProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param userId User id that belongs to the task.
   * @param query Query that will refine the final result of the search.
   * @returns Return an array of tasks if finds it or an empty array if does not.
   */
  getAllInvoices: <T extends AllInvoicesDocument>(
    query: QueryAllInvoicesProtocol,
    userId: string
  ) => Promise<QueryResultProtocol<T>>
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
