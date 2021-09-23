import { UserDbRepository } from '@/infra/database/mongodb/repositories'
import { makeUserRepository } from './user-repository-factory'

export const makeUserDbRepository = (): UserDbRepository => {
  const userRepository = makeUserRepository()

  return new UserDbRepository(userRepository)
}
