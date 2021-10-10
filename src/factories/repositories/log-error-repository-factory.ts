import { LogErrorRepository } from '@/infra/database/repositories'

import { makeCreateLogErrorRepository } from '.'
import { makeMongoDb } from '../database/mongo-db-factory'

export const makeLogErrorRepository = (): LogErrorRepository => {
  const createLogErrorRepository = makeCreateLogErrorRepository()
  const database = makeMongoDb()

  return new LogErrorRepository(createLogErrorRepository, database)
}
