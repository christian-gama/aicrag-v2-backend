import { ITask } from '@/domain'

import { IQuery, IQueryResult } from '@/infra/database/protocols/queries-protocol'

export interface IInvoiceRepository extends IGetAllInvoices, IGetInvoiceByMonth {}

export interface IQueryInvoice extends IQuery {
  month: string
  year: string
  taskId?: string
  type: string
}

export interface IQueryAllInvoices extends IQuery {
  type: 'QA' | 'TX' | { $ne: null }
}

export interface IAllInvoicesDocument {
  date: {
    month: number
    year: number
  }
  tasks: number
  totalUsd: number
}

export interface IGetAllInvoices {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param userId User id that belongs to the task.
   * @param query Query that will refine the final result of the search.
   * @returns Return an array of tasks if finds it or an empty array if does not.
   */
  getAllInvoices: <T extends IAllInvoicesDocument>(query: IQueryAllInvoices, userId: string) => Promise<IQueryResult<T>>
}

export interface IGetInvoiceByMonth {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param userId User id that belongs to the task.
   * @param query Query that will refine the final result of the search.
   * @returns Return an array of tasks if finds it or an empty array if does not.
   */
  getInvoiceByMonth: <T extends ITask>(query: IQueryInvoice, userId: string) => Promise<IQueryResult<T>>
}
