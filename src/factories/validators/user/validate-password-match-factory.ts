import { ValidatePasswordMatch } from '@/application/validators/user'

import { makeBcryptAdapter } from '../../cryptography'
import { makeUserRepository } from '../../repositories'

export const makeValidatePasswordMatch = (): ValidatePasswordMatch => {
  const hasher = makeBcryptAdapter()
  const userRepository = makeUserRepository()

  return new ValidatePasswordMatch(hasher, userRepository)
}
