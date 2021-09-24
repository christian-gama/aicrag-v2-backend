import { ValidatePasswordMatch } from '@/application/usecases/validators'

import { makeBcryptAdapter } from '../cryptography'
import { makeUserDbRepository } from '../repositories'

export const makeValidatePasswordMatch = (): ValidatePasswordMatch => {
  const hasher = makeBcryptAdapter()
  const userDbRepository = makeUserDbRepository()

  return new ValidatePasswordMatch(hasher, userDbRepository)
}
