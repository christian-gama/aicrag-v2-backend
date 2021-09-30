import { ValidateEmailExists } from '@/application/validators'

import { makeUserDbRepository } from '../repositories'

export const makeValidateEmailExists = (): ValidateEmailExists => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateEmailExists(userDbRepository)
}