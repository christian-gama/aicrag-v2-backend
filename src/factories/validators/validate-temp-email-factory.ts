import { ValidateTempEmail } from '@/application/validators/user'

import { makeUserDbRepository } from '../repositories'

export const makeValidateTempEmail = (): ValidateTempEmail => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateTempEmail(userDbRepository)
}
