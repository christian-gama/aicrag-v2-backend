import { IDateUtils, IUuid } from '@/domain/helpers'
import { ICreateTaskRepository } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class CreateTaskRepository implements ICreateTaskRepository {
  constructor (private readonly dateUtils: IDateUtils, private readonly uuid: IUuid) {}

  create (taskData: ITaskData): ITask {
    const { commentary, date, duration, status, taskId, type, user } = taskData

    const d = this.dateUtils.getUTCDate(date)
    const handicap = user.settings.handicap
    const id = this.uuid.generate()
    const _duration = Math.round(duration * 100) / 100
    const usd = type === 'TX' ? (_duration / 60) * 65 * handicap : (_duration / 60) * 112.5 * handicap

    const result: ITask = {
      commentary: commentary ?? '',
      date: {
        day: d.getUTCDate(),
        full: d,
        hours: d.toLocaleTimeString('pt-br', { timeZone: 'UTC' }),
        month: d.getUTCMonth(),
        year: d.getUTCFullYear()
      },
      duration: _duration,
      id,
      logs: {
        createdAt: new Date(Date.now()),
        updatedAt: null
      },
      status,
      taskId: taskId ?? '',
      type,
      usd: Math.round(usd * 100) / 100,
      user: user.personal.id
    }

    return result
  }
}
