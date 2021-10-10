import { ITaskData, ITask } from '@/domain/task'

export interface CreateTaskRepositoryProtocol {
  createTask: (taskData: ITaskData) => ITask
}
