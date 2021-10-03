import { UuidProtocol } from '@/domain/helpers'
import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ITask, ITaskData } from '@/domain/task'

export class TaskRepository implements TaskRepositoryProtocol {
  constructor (private readonly uuid: UuidProtocol) {}

  createTask (taskData: ITaskData): ITask {
    const { commentary, date, duration, taskId, type, user } = taskData

    const id = this.uuid.generate()

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
      taskId: taskId ?? null,
      type,
      user
    }
  }
}
