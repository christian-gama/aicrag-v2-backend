import { ITask, ITaskData } from '@/domain'
import { ICreateTaskRepository } from '@/domain/repositories'
import { ITaskRepository } from '@/domain/repositories/task'

import { IDatabase } from '../protocols'
import { IQuery, IQueryResult } from '../protocols/queries-protocol'
import { ITaskDbFilter } from '../protocols/update-task-options'

export class TaskRepository implements ITaskRepository {
  constructor (private readonly createTaskRepository: ICreateTaskRepository, private readonly database: IDatabase) {}

  async deleteTask (id: string, userId: string): Promise<boolean> {
    const taskCollection = this.database.collection('tasks')

    const deleted = await taskCollection.deleteOne({ id, user: userId })

    return deleted
  }

  async findAllTasks<T extends ITask>(userId: string, query: IQuery): Promise<IQueryResult<T>> {
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.findAll<ITask>({ user: userId }, query)

    return result as IQueryResult<T>
  }

  async findTaskById (id: string, userId: string): Promise<ITask | null> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ id, user: userId })

    return task
  }

  async findTaskByTaskId (taskId: string | null, userId: string): Promise<ITask | null> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ taskId, user: userId })

    return task
  }

  async saveTask (taskData: ITaskData): Promise<ITask> {
    const taskCollection = this.database.collection('tasks')

    const task = this.createTaskRepository.createTask(taskData)

    return await taskCollection.insertOne(task)
  }

  async updateTask<T extends ITask | null>(id: string, userId: string, update: ITaskDbFilter): Promise<T> {
    const taskCollection = this.database.collection('tasks')

    const updatedTask = await taskCollection.updateOne<ITask>({ id, user: userId }, update)

    return updatedTask as T
  }
}
