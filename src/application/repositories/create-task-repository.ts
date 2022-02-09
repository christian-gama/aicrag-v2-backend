import { IUuid } from '@/domain/helpers'
import { ICreateTaskRepository } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class CreateTaskRepository implements ICreateTaskRepository {
  constructor (private readonly uuid: IUuid) {}

  create (taskData: ITaskData): ITask {
    const { commentary, date, duration, status, taskId, type, user } = taskData

    const d = this.getDate(date)
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

  /**
   * @param date '1970-01-01T00:00:00.000-00:00 / yyyy-MM-ddTHH:mm:ss.SSSZ-HH:mm'
   */
  private getDate (date: string): Date {
    const [year, month, day, hour, minute, seconds, milliseconds] = date
      .split('-')
      .join(' ')
      .split('T')
      .join(' ')
      .split(':')
      .join(' ')
      .split('.')
      .join(' ')
      .split(' ')

    return new Date(+year, +month - 1, +day, +hour, +minute, +seconds, +milliseconds)
  }
}
