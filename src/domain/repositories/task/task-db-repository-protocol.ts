import { ITask, ITaskData } from '@/domain'

export interface TaskDbRepositoryProtocol extends SaveTaskDbProtocol {}

export interface SaveTaskDbProtocol {
  saveTask: (taskData: ITaskData) => Promise<ITask>
}
