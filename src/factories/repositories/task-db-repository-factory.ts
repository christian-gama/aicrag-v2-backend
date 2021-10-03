import { TaskDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeTaskRepository } from './task-repository-factory'

export const makeTaskDbRepository = (): TaskDbRepository => {
  const database = makeMongoDb()
  const taskRepository = makeTaskRepository()

  return new TaskDbRepository(database, taskRepository)
}
