import { ITask, IUser } from '@/domain'

import { ICollectionMethods } from '@/infra/database/protocols'

import { makeFakeTask } from '../__mocks__'

type TaskProperty = {
  [Property in keyof Partial<ITask>]: Partial<ITask[Property]>
}

export const taskHelper = {
  getTasks: (table: any, tasks: ITask[], user: IUser): ITask[] => {
    return table.map((row, index) => {
      const date = new Date(Date.parse(row.date))

      const result = {
        commentary: row.commentary,
        date: {
          day: date.getUTCDate(),
          full: date.toISOString(),
          hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear()
        },
        duration: +row.duration,
        id: tasks[index].id,
        logs: {
          createdAt: tasks[index].logs.createdAt.toISOString(),
          updatedAt: tasks[index].logs.updatedAt
        },
        status: row.status,
        taskId: row.taskId,
        type: row.type,
        usd: Math.round((+row.duration / 60) * (row.type === 'TX' ? 65 : 112.5) * 100) / 100,
        user: {
          personal: {
            email: user.personal.email,
            id: user.personal.id,
            name: user.personal.name
          },
          settings: {
            currency: user.settings.currency
          }
        }
      }

      return result
    })
  },
  insertTask: async (collection: ICollectionMethods, user: IUser, taskProperty: TaskProperty): Promise<ITask> => {
    const result = makeFakeTask(user, taskProperty)
    await collection.insertOne(result)

    return result
  },
  insertTasks: async (table: any, taskCollection: ICollectionMethods, user: IUser): Promise<ITask[]> => {
    return await Promise.all(
      table.map(async (row) => {
        const date = new Date(Date.parse(row.date))

        const result = await taskHelper.insertTask(taskCollection, user, {
          commentary: row.commentary,
          date: {
            day: date.getUTCDate(),
            full: date,
            hours: date.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
            month: date.getUTCMonth(),
            year: date.getUTCFullYear()
          },
          duration: +row.duration,
          status: row.status,
          taskId: row.taskId,
          type: row.type,
          usd: Math.round((+row.duration / 60) * (row.type === 'TX' ? 65 : 112.5) * 100) / 100
        })

        return result
      })
    )
  }
}
