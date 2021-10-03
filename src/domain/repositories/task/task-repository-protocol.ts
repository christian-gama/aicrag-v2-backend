import { IPartialTask } from '@/domain/task/partial-task-protocol'
import { ITask } from '@/domain/task/task-protocol'

export interface TaskRepositoryProtocol {
  createTask: (taskData: IPartialTask) => ITask
}
