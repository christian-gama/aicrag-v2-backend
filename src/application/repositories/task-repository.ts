import { UuidProtocol } from '@/domain/helpers'
import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class TaskRepository implements TaskRepositoryProtocol {
  constructor (private readonly uuid: UuidProtocol) {}

  createTask (taskData: ITaskData): ITask {
    const { commentary, date, duration, status, taskId, type, user } = taskData

    const handicap = user.settings.handicap
    const id = this.uuid.generate()
    const usd = type === 'TX' ? (duration / 60) * 65 * handicap : (duration / 60) * 112.5 * handicap

    return {
      commentary: commentary ?? null,
      date: {
        day: date.getDate(),
        full: date,
        hours: date.toLocaleTimeString(),
        month: date.getMonth(),
        year: date.getFullYear()
      },
      duration,
      id,
      logs: {
        createdAt: new Date(Date.now()),
        updatedAt: null
      },
      status,
      taskId: taskId ?? null,
      type,
      usd,
      user
    }
  }
}
