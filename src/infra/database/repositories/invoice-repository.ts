import { ITask } from '@/domain'
import { GetInvoiceByMonthProtocol } from '@/domain/repositories/invoice/invoice-repository-protocol'

import { getRegexTaskId } from '../helpers/get-regex-task-id'
import { DatabaseProtocol } from '../protocols'
import { QueryProtocol, QueryResultProtocol } from '../protocols/queries-protocol'

export class InvoiceRepository implements GetInvoiceByMonthProtocol {
  constructor (private readonly database: DatabaseProtocol) {}

  async getInvoiceByMonth<T extends ITask>(
    data: {
      month: number
      taskId?: string
      userId: string
      year: number
    },
    query: QueryProtocol
  ): Promise<QueryResultProtocol<T>> {
    const { month, taskId, userId, year } = data
    const _taskId = getRegexTaskId(taskId)
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.aggregate<ITask>(
      [
        {
          $match: {
            $and: [{ 'date.month': { $eq: month } }, { 'date.year': { $eq: year } }],
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
