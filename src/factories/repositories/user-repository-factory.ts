import { UserRepository } from '@/infra/database/repositories'

import { makeMongoDb } from '../database/mongo-db-factory'
import { makeCreateUserRepository } from './create-user-repository-factory'

export const makeUserRepository = (): UserRepository => {
  const createUserRepository = makeCreateUserRepository()
  const database = makeMongoDb()

  return new UserRepository(createUserRepository, database)
}
