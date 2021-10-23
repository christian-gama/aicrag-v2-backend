import { ITask, ITaskData } from '@/domain'

import { IQuery, IQueryResult } from '@/infra/database/protocols/queries-protocol'
import { ITaskDbFilter } from '@/infra/database/protocols/update-task-options'

export interface ITaskRepository
  extends IDeleteTask,
  IFindAllTasks,
  IFindTaskById,
  IFindTaskByTaskId,
  ISaveTask,
  IUpdateTask {}

export interface IDeleteTask {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be deleted.
   * @param userId The user id which belongs to the task
   * @returns Return true if deleted, false otherwise.
   */
  deleteTask: (id: string, userId: string) => Promise<boolean>
}
export interface IFindAllTasks {
  /**
   * @async Asynchronous method.
   * @description Receive a user id and tries to find all tasks that belongs to that user.
   * @param userId The user id which belongs to the task
   * @param query Query that will refine the final result of the search.
   * @returns Return all tasks that belongs to that user or null if there is no task.
   */
  findAllTasks: <T extends ITask>(userId: string, query: IQuery) => Promise<IQueryResult<T>>
}

export interface IFindTaskById {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findTaskById: (id: string, userId: string) => Promise<ITask | null>
}

export interface IFindTaskByTaskId {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param taskId The taskId that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findTaskByTaskId: (taskId: string | null, userId: string) => Promise<ITask | null>
}

export interface ISaveTask {
  /**
   * @async Asynchronous method.
   * @description Receive a task data and then save it on database.
   * @param taskData Task that will be saved on database.
   * @returns Return the saved task.
   */
  saveTask: (taskData: ITaskData) => Promise<ITask>
}

export interface IUpdateTask {
  /**
   * @async Asynchronous method.
   * @description Receive a task and then update it based on its id.
   * @param id Unique Id from the task that will be updated on database.
   * @param update Properties that will be updated.
   * @returns Return the updated task or null.
   */
  updateTask: <T extends ITask | null>(id: string, update: ITaskDbFilter) => Promise<T>
}
