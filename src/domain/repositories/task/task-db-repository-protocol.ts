import { ITask, ITaskData } from '@/domain'

export interface TaskDbRepositoryProtocol extends FindTaskByIdDbProtocol, SaveTaskDbProtocol {}

export interface FindTaskByIdDbProtocol {
  saveTask: (taskData: ITaskData) => Promise<ITask>
}

export interface SaveTaskDbProtocol {
  saveTask: (taskData: ITaskData) => Promise<ITask>
}
