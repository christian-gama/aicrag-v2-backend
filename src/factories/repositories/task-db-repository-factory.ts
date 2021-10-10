import { TaskDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeCreateTaskRepository } from './create-task-repository-factory'

export const makeTaskDbRepository = (): TaskDbRepository => {
  const createTaskRepository = makeCreateTaskRepository()
  const database = makeMongoDb()

  return new TaskDbRepository(createTaskRepository, database)
}
