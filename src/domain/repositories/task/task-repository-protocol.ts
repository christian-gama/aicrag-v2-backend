import { ITaskData, ITask } from '@/domain/task'

export interface TaskRepositoryProtocol {
  createTask: (taskData: ITaskData) => ITask
}
