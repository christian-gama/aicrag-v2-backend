import { ITaskData, ITask } from '@/domain/task'

export interface ICreateTaskRepository {
  create: (taskData: ITaskData) => ITask
}
