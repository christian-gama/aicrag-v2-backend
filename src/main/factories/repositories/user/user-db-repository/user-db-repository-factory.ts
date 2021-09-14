import { UserDbRepository } from '@/infra/database/mongodb/user/user-db-repository'
import { makeUserRepository } from '../user-repository/user-repository-factory'

export const makeUserDbRepository = (): UserDbRepository => {
  const userRepository = makeUserRepository()

  return new UserDbRepository(userRepository)
}
