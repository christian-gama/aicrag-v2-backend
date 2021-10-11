import { ITask, ITaskData } from '@/domain'
import { CreateTaskRepositoryProtocol } from '@/domain/repositories'
import { TaskRepositoryProtocol } from '@/domain/repositories/task'

import { DatabaseProtocol } from '../protocols'
import { QueryProtocol, QueryResultProtocol } from '../protocols/queries-protocol'
import { TaskDbFilter } from '../protocols/update-task-options'

export class TaskRepository implements TaskRepositoryProtocol {
  constructor (
    private readonly createTaskRepository: CreateTaskRepositoryProtocol,
    private readonly database: DatabaseProtocol
  ) {}

  async deleteTask (id: string, userId: string): Promise<boolean> {
    const taskCollection = this.database.collection('tasks')

    const deleted = await taskCollection.deleteOne({ id, userId })

    return deleted
  }

  async findAllTasks<T extends ITask>(
    userId: string,
    query: QueryProtocol
  ): Promise<QueryResultProtocol<T>> {
    const taskCollection = this.database.collection('tasks')

    const result = await taskCollection.findAll<ITask>({ userId }, query)

    return result as QueryResultProtocol<T>
  }

  async findTaskById (id: string, userId: string): Promise<ITask | null> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ id, userId })

    return task
  }

  async findTaskByTaskId (taskId: string | null, userId: string): Promise<ITask | null> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ taskId, userId })

    return task
  }

  async saveTask (taskData: ITaskData): Promise<ITask> {
    const taskCollection = this.database.collection('tasks')

    const task = this.createTaskRepository.createTask(taskData)

    return await taskCollection.insertOne(task)
  }

  async updateTask<T extends ITask | null>(id: string, update: TaskDbFilter): Promise<T> {
    const taskCollection = this.database.collection('tasks')

    const updatedTask = await taskCollection.updateOne<ITask>({ id }, update)

    return updatedTask as T
  }
}