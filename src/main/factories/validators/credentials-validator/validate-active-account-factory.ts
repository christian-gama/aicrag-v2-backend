import { ValidateActiveAccount } from '@/application/usecases/validators/credentials-validator/validate-active-account'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeValidateActiveAccount = (): ValidateActiveAccount => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateActiveAccount(userDbRepository)
}
