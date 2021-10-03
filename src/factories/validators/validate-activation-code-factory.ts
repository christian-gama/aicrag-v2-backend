import { ValidateActivationCode } from '@/application/validators/user'

import { makeUserDbRepository } from '../repositories'

export const makeValidateActivationCode = (): ValidateActivationCode => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateActivationCode(userDbRepository)
}
