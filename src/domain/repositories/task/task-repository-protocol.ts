import { ITask, ITaskData } from '@/domain'

import { QueryProtocol, QueryResultProtocol } from '@/infra/database/protocols/queries-protocol'
import { TaskDbFilter } from '@/infra/database/protocols/update-task-options'

export interface TaskRepositoryProtocol
  extends DeleteTaskProtocol,
  FindAllTasksProtocol,
  FindTaskByIdProtocol,
  FindTaskByTaskIdProtocol,
  SaveTaskProtocol,
  UpdateTaskProtocol {}

export interface DeleteTaskProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be deleted.
   * @param userId The user id which belongs to the task
   * @returns Return true if deleted, false otherwise.
   */
  deleteTask: (id: string, userId: string) => Promise<boolean>
}
export interface FindAllTasksProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user id and tries to find all tasks that belongs to that user.
   * @param userId The user id which belongs to the task
   * @param query Query that will refine the final result of the search.
   * @returns Return all tasks that belongs to that user or null if there is no task.
   */
  findAllTasks: <T extends ITask>(
    userId: string,
    query: QueryProtocol
  ) => Promise<QueryResultProtocol<T>>
}

export interface FindTaskByIdProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param id Unique id from the task that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findTaskById: (id: string, userId: string) => Promise<ITask | null>
}

export interface FindTaskByTaskIdProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an id and a user id and tries to find a task that belongs to that user.
   * @param taskId The taskId that will be searched for.
   * @param userId The user id which belongs to the task
   * @returns Return a task if finds it or null if does not.
   */
  findTaskByTaskId: (taskId: string | null, userId: string) => Promise<ITask | null>
}

export interface SaveTaskProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a task data and then save it on database.
   * @param taskData Task that will be saved on database.
   * @returns Return the saved task.
   */
  saveTask: (taskData: ITaskData) => Promise<ITask>
}

export interface UpdateTaskProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a task and then update it based on its id.
   * @param id Unique Id from the task that will be updated on database.
   * @param update Properties that will be updated.
   * @returns Return the updated task or null.
   */
  updateTask: <T extends ITask | null>(id: string, update: TaskDbFilter) => Promise<T>
}
