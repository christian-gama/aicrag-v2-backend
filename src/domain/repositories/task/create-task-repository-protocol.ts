import { ITaskData, ITask } from '@/domain/task'

export interface ICreateTaskRepository {
  createTask: (taskData: ITaskData) => ITask
}
