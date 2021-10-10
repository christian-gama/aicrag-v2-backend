import { LogErrorDbRepository } from '@/infra/database/repositories'

import { makeCreateLogErrorRepository } from '.'
import { makeMongoDb } from '../database/mongo-db-factory'

export const makeLogErrorDbRepository = (): LogErrorDbRepository => {
  const createLogErrorRepository = makeCreateLogErrorRepository()
  const database = makeMongoDb()

  return new LogErrorDbRepository(createLogErrorRepository, database)
}
