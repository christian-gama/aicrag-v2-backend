import { ValidateActiveAccount } from '@/application/validators/user'

import { makeUserRepository } from '../../repositories'

export const makeValidateActiveAccount = (): ValidateActiveAccount => {
  const userRepository = makeUserRepository()

  return new ValidateActiveAccount(userRepository)
}
