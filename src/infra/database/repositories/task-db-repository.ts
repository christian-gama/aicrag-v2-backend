import { ITask, ITaskData } from '@/domain'
import { TaskRepositoryProtocol } from '@/domain/repositories'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'

import { DatabaseProtocol } from '../protocols'

export class TaskDbRepository implements TaskDbRepositoryProtocol {
  constructor (
    private readonly database: DatabaseProtocol,
    private readonly taskRepository: TaskRepositoryProtocol
  ) {}

  async saveTask (taskData: ITaskData): Promise<ITask> {
    const taskCollection = this.database.collection('users')

    const user = this.taskRepository.createTask(taskData)

    return await taskCollection.insertOne(user)
  }
}
