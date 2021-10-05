import { ITask, ITaskData } from '@/domain'
import { TaskRepositoryProtocol } from '@/domain/repositories'
import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'

import { DatabaseProtocol } from '../protocols'

export class TaskDbRepository implements TaskDbRepositoryProtocol {
  constructor (
    private readonly database: DatabaseProtocol,
    private readonly taskRepository: TaskRepositoryProtocol
  ) {}

  async findTaskById (id: string, userId: string): Promise<ITask | undefined> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ id, userId })

    if (task) return task
  }

  async findTaskByTaskId (taskId: string | null, userId: string): Promise<ITask | undefined> {
    const taskCollection = this.database.collection('tasks')

    const task = await taskCollection.findOne<ITask>({ taskId, userId })

    if (task) return task
  }

  async saveTask (taskData: ITaskData): Promise<ITask> {
    const taskCollection = this.database.collection('tasks')

    const task = this.taskRepository.createTask(taskData)

    return await taskCollection.insertOne(task)
  }
}
