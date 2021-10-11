import { ITask } from '@/domain'
import {
  GetInvoiceByMonthProtocol,
  QueryAllInvoicesProtocol,
  QueryInvoiceProtocol
} from '@/domain/repositories/invoice/invoice-repository-protocol'

import { getRegexTaskId } from '../helpers/get-regex-task-id'
import { DatabaseProtocol } from '../protocols'
import { QueryResultProtocol } from '../protocols/queries-protocol'

export class InvoiceRepository implements GetInvoiceByMonthProtocol {
  constructor (private readonly database: DatabaseProtocol) {}

  async getAllInvoices<T extends ITask>(
    query: QueryAllInvoicesProtocol,
    userId: string
  ): Promise<QueryResultProtocol<T>> {
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.aggregate<T>(
      [
        {
          $match: {
            type: query.type,
            userId
          }
        },
        {
          $group: {
            _id: { month: '$date.month', year: '$date.year' },
            totalUsd: { $sum: '$usd' }
          }
        }
      ],
      query
    )

    return result
  }

  async getInvoiceByMonth<T extends ITask>(
    query: QueryInvoiceProtocol,
    userId: string
  ): Promise<QueryResultProtocol<T>> {
    const { month, taskId, year } = query
    const _taskId = getRegexTaskId(taskId)
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.aggregate<ITask>(
      [
        {
          $match: {
            $and: [{ 'date.month': { $eq: +month } }, { 'date.year': { $eq: +year } }],
            taskId: _taskId,
            userId
          }
        }
      ],
      query
    )

    return result as QueryResultProtocol<T>
  }
}
