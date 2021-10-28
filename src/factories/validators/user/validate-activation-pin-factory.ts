import { ValidateActivationPin } from '@/application/validators/user'

import { makeUserRepository } from '../../repositories'

export const makeValidateActivationPin = (): ValidateActivationPin => {
  const userRepository = makeUserRepository()

  return new ValidateActivationPin(userRepository)
}
