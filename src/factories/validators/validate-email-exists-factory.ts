import { ValidateEmailExists } from '@/application/validators/user'

import { makeUserDbRepository } from '../repositories'

export const makeValidateEmailExists = (): ValidateEmailExists => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateEmailExists(userDbRepository)
}
