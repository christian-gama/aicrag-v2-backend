import { ValidatePasswordToken } from '@/application/validators/user'

import { makeUserRepository } from '@/factories/repositories'

export const makeValidatePasswordToken = (): ValidatePasswordToken => {
  const userRepository = makeUserRepository()

  return new ValidatePasswordToken(userRepository)
}
