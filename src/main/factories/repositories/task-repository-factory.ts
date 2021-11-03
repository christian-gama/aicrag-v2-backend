import { TaskRepository } from '@/infra/database/repositories'
import { makeMongoDb } from '../database/mongo-db-factory'
import { makeCreateTaskRepository } from './create-task-repository-factory'

export const makeTaskRepository = (): TaskRepository => {
  const createTaskRepository = makeCreateTaskRepository()
  const database = makeMongoDb()

  return new TaskRepository(createTaskRepository, database)
}
