import { ClearUserDatabase } from '@/main/scheduler/clear-user-database'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeLogErrorRepository } from '../repositories'

export const makeClearUserDatabase = (): ClearUserDatabase => {
  const database = makeMongoDb()
  const logErrorRepository = makeLogErrorRepository()

  return new ClearUserDatabase(database, logErrorRepository)
}
