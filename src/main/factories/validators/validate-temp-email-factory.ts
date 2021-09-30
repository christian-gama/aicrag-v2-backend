import { ValidateTempEmail } from '@/application/usecases/validators'

import { makeUserDbRepository } from '../repositories'

export const makeValidateTempEmail = (): ValidateTempEmail => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateTempEmail(userDbRepository)
}
