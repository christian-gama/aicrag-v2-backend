import { ITask } from '@/domain'
import {
  IAllInvoicesDocument,
  IGetInvoiceByMonth,
  IQueryAllInvoices,
  IQueryInvoice
} from '@/domain/repositories/invoice/invoice-repository.model'
import { getDuration } from '../helpers/get-duration'
import { getPeriod } from '../helpers/get-period'
import { getRegexTaskId } from '../helpers/get-regex-task-id'
import { getType } from '../helpers/get-type'
import { IDatabase } from '../protocols'
import { IQueryResult } from '../protocols/queries.model'

export class InvoiceRepository implements IGetInvoiceByMonth {
  constructor (private readonly database: IDatabase) {}

  async getAll<T extends IAllInvoicesDocument>(query: IQueryAllInvoices, userId: string): Promise<IQueryResult<T>> {
    const taskCollection = this.database.collection('tasks')
    const type = getType(query.type as 'QA' | 'TX' | 'both')

    const result = await taskCollection.aggregate<T>(
      [
        {
          $match: {
            $and: [{ type: type }, { user: userId }]
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
                  $subtract: [{ $multiply: ['$sumUsd', 100] }, { $mod: [{ $multiply: ['$sumUsd', 100] }, 1] }]
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

  async getByMonth<T extends ITask>(query: IQueryInvoice, userId: string): Promise<IQueryResult<T>> {
    const { duration, month, period, taskId, type, year, operator } = query
    const _duration = getDuration(duration, operator)
    const _period = getPeriod(month, year, period)
    const _taskId = getRegexTaskId(taskId)
    const _type = getType(type)
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.aggregate<ITask>(
      [
        {
          $match: {
            $and: _period,
            duration: _duration,
            taskId: _taskId,
            type: _type,
            user: userId
          }
        }
      ],
      query
    )

    return result as IQueryResult<T>
  }
}
