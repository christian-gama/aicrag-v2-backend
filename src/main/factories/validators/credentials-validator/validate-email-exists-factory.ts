import { ValidateEmailExists } from '@/application/usecases/validators/credentials-validator'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeValidateEmailExists = (): ValidateEmailExists => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateEmailExists(userDbRepository)
}
