import { UuidProtocol } from '@/domain/helpers'
import { CreateTaskRepositoryProtocol } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class CreateTaskRepository implements CreateTaskRepositoryProtocol {
  constructor (private readonly uuid: UuidProtocol) {}

  createTask (taskData: ITaskData): ITask {
    const { commentary, date, duration, status, taskId, type, user } = taskData

    const d = new Date(Date.parse(date))
    const handicap = user.settings.handicap
    const id = this.uuid.generate()
    const _duration = Math.round(duration * 100) / 100
    const usd = type === 'TX' ? (_duration / 60) * 65 * handicap : (_duration / 60) * 112.5 * handicap

    return {
      commentary: commentary ?? '',
      date: {
        day: d.getDate(),
        full: d,
        hours: d.toLocaleTimeString(),
        month: d.getMonth(),
        year: d.getFullYear()
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
      userId: user.personal.id
    }
  }
}
