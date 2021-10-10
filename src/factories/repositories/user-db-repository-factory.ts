import { UserDbRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeCreateUserRepository } from './create-user-repository-factory'

export const makeUserDbRepository = (): UserDbRepository => {
  const createUserRepository = makeCreateUserRepository()
  const database = makeMongoDb()

  return new UserDbRepository(createUserRepository, database)
}
