import { ValidateActivationCode } from '@/application/validators/user'

import { makeUserRepository } from '../../repositories'

export const makeValidateActivationCode = (): ValidateActivationCode => {
  const userRepository = makeUserRepository()

  return new ValidateActivationCode(userRepository)
}
