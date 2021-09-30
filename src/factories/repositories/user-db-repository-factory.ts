import { UserDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeUserRepository } from './user-repository-factory'

export const makeUserDbRepository = (): UserDbRepository => {
  const database = makeMongoDb()
  const userRepository = makeUserRepository()

  return new UserDbRepository(database, userRepository)
}
