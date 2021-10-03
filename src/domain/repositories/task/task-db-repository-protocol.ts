import { ITask, ITaskData, IUser } from '@/domain'

export interface TaskDbRepositoryProtocol extends FindTaskByIdDbProtocol, SaveTaskDbProtocol {}

export interface FindTaskByIdDbProtocol {
  findTaskById: (id: string, user: IUser) => Promise<ITask | undefined>
}

export interface SaveTaskDbProtocol {
  saveTask: (taskData: ITaskData) => Promise<ITask>
}
