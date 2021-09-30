import { LogErrorDbRepository } from '@/infra/database/repositories'

import { makeLogErrorRepository } from '.'
import { makeMongoDb } from '../database/mongo-db-factory'

export const makeLogErrorDbRepository = (): LogErrorDbRepository => {
  const database = makeMongoDb()
  const logErrorRepository = makeLogErrorRepository()

  return new LogErrorDbRepository(database, logErrorRepository)
}
