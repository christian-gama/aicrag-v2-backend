import { UuidProtocol } from '@/domain/helpers'
import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class TaskRepository implements TaskRepositoryProtocol {
  constructor (private readonly uuid: UuidProtocol) {}

  createTask (taskData: ITaskData): ITask {
    const { commentary, date, duration, status, taskId, type, user } = taskData

    const d = new Date(Date.parse(date))
    const handicap = user.settings.handicap
    const id = this.uuid.generate()
    const usd = type === 'TX' ? (duration / 60) * 65 * handicap : (duration / 60) * 112.5 * handicap

    return {
      commentary: commentary ?? null,
      date: {
        day: d.getDate(),
        full: d,
        hours: d.toLocaleTimeString(),
        month: d.getMonth(),
        year: d.getFullYear()
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
      userId: user.personal.id
    }
  }
}
