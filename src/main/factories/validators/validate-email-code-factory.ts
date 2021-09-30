import { ValidateEmailCode } from '@/application/usecases/validators'

import { makeUserDbRepository } from '../repositories'

export const makeValidateEmailCode = (): ValidateEmailCode => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateEmailCode(userDbRepository)
}
