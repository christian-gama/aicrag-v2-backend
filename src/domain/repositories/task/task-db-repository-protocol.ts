import { ITask, ITaskData, IUser } from '@/domain'

export interface TaskDbRepositoryProtocol extends FindTaskByIdDbProtocol, SaveTaskDbProtocol {}

export interface FindTaskByIdDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an task id and tries to find it on database.
   * @param id The task id that will be searched for.
   * @returns Return a task if finds it or undefined if does not.
   */
  findTaskById: (id: string, user: IUser) => Promise<ITask | undefined>
}

export interface SaveTaskDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an task and then save a task on database.
   * @param task Task that will be saved on database.
   * @returns Return the saved task.
   */
  saveTask: (taskData: ITaskData) => Promise<ITask>
}
