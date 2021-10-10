import { ValidateEmailExists } from '@/application/validators/user'

import { makeUserRepository } from '../../repositories'

export const makeValidateEmailExists = (): ValidateEmailExists => {
  const userRepository = makeUserRepository()

  return new ValidateEmailExists(userRepository)
}
