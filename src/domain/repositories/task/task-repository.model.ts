import { ITask, ITaskData } from '@/domain'
import { IQuery, IQueryResult } from '@/infra/database/protocols/queries.model'
import { ITaskDbFilter } from '@/infra/database/protocols/update-task-options.model'

export interface ITaskRepository
  extends IDeleteTask,
  IDeleteManyTask,
  IFindAllTasks,
  IFindTaskById,
  IFindTaskByTaskId,
  ISaveTask,
  ISuperFindTaskById,
  ISuperUpdateById,
  IUpdateById {}

export interface IDeleteManyTask {
  /**
   * @async Asynchronous method.
   * @description Receive a user id and tries to find all tasks that belongs to that user.
   * @param userId The user id which belongs to the tasks
   * @returns Return the amount of tasks that were deleted.
   */
  deleteManyByUserId: (userId: string) => Promise<number>
}

export interface IDeleteTask {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be deleted.
   * @param userId The user id which belongs to the task
   * @returns Return true if deleted, false otherwise.
   */
  deleteById: (id: string, userId: string) => Promise<boolean>
}
export interface IFindAllTasks {
  /**
   * @async Asynchronous method.
   * @description Receive a user id and tries to find all tasks that belongs to that user.
   * @param userId The user id which belongs to the task
   * @param query Query that will refine the final result of the search.
   * @returns Return all tasks that belongs to that user or null if there is no task.
   */
  findAll: <T extends ITask>(userId: string, query: IQuery) => Promise<IQueryResult<T>>
}

export interface IFindTaskById {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findById: (id: string, userId: string) => Promise<ITask | null>
}

export interface IFindTaskByTaskId {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param taskId The taskId that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findByTaskId: (taskId: string | null, userId: string) => Promise<ITask | null>
}

export interface ISaveTask {
  /**
   * @async Asynchronous method.
   * @description Receive a task data and then save it on database.
   * @param taskData Task that will be saved on database.
   * @returns Return the saved task.
   */
  save: (taskData: ITaskData) => Promise<ITask>
}

export interface ISuperFindTaskById {
  /**
   * @async Asynchronous method.
   * @description Method used by administrator. Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be searched for.
   * @returns Return a task if finds it or null if does not.
   */
  superFindById: (id: string) => Promise<ITask | null>
}

export interface ISuperUpdateById {
  /**
   * @async Asynchronous method.
   * @description Method used by administrator. Receive a task and then update it based on its id.
   * @param id Unique Id from the task that will be updated on database.
   * @param update Properties that will be updated.
   * @returns Return the updated task or null.
   */
  superUpdateById: <T extends ITask | null>(id: string, update: ITaskDbFilter) => Promise<T>
}

export interface IUpdateById {
  /**
   * @async Asynchronous method.
   * @description Receive a task and then update it based on its id.
   * @param id Unique Id from the task that will be updated on database.
   * @param userId Unique user id that belongs to the task.
   * @param update Properties that will be updated.
   * @returns Return the updated task or null.
   */
  updateById: <T extends ITask | null>(id: string, userId: string, update: ITaskDbFilter) => Promise<T>
}
