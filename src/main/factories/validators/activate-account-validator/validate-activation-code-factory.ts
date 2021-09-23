import { ValidateActivationCode } from '@/application/usecases/validators'
import { makeUserDbRepository } from '../../repositories/user/user-db-repository/user-db-repository-factory'

export const makeValidateActivationCode = (): ValidateActivationCode => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateActivationCode(userDbRepository)
}
