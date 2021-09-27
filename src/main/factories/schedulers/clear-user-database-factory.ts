import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeLogErrorDbRepository } from '../repositories'

export const makeClearUserDatabase = (): ClearUserDatabase => {
  const database = makeMongoDb()
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new ClearUserDatabase(database, logErrorDbRepository)
}
