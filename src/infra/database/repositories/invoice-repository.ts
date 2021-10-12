import { ITask } from '@/domain'
import {
  AllInvoicesDocument,
  GetInvoiceByMonthProtocol,
  QueryAllInvoicesProtocol,
  QueryInvoiceProtocol
} from '@/domain/repositories/invoice/invoice-repository-protocol'

import { getRegexTaskId } from '../helpers/get-regex-task-id'
import { getType } from '../helpers/get-type'
import { DatabaseProtocol } from '../protocols'
import { QueryResultProtocol } from '../protocols/queries-protocol'

export class InvoiceRepository implements GetInvoiceByMonthProtocol {
  constructor (private readonly database: DatabaseProtocol) {}

  async getAllInvoices<T extends AllInvoicesDocument>(
    query: QueryAllInvoicesProtocol,
    userId: string
  ): Promise<QueryResultProtocol<T>> {
    const taskCollection = this.database.collection('tasks')
    const type = getType(query.type as 'QA' | 'TX' | 'both')

    const result = await taskCollection.aggregate<T>(
      [
        {
          $match: {
            $and: [{ type: type }, { userId }]
          }
        },
        {
          $group: {
            _id: {
              date: { month: '$date.month', year: '$date.year' }
            },
            sumUsd: { $sum: '$usd' },
            tasks: { $sum: 1 }
          }
        },
        {
          $addFields: {
            date: '$_id.date',
            tasks: '$tasks',
            totalUsd: {
              // Round 2 decimals
              $divide: [
                {
                  $subtract: [
                    { $multiply: ['$sumUsd', 100] },
                    { $mod: [{ $multiply: ['$sumUsd', 100] }, 1] }
                  ]
                },
                100
              ]
            }
          }
        },
        {
          $project: {
            _id: 0,
            sumUsd: 0
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
    const { month, taskId, type, year } = query
    const _taskId = getRegexTaskId(taskId)
    const _type = getType(type as 'QA' | 'TX' | 'both')
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.aggregate<ITask>(
      [
        {
          $match: {
            $and: [{ 'date.month': { $eq: +month } }, { 'date.year': { $eq: +year } }],
            taskId: _taskId,
            type: _type,
            userId
          }
        }
      ],
      query
    )

    return result as QueryResultProtocol<T>
  }
}
