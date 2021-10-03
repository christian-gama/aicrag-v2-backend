import { ValidateActiveAccount } from '@/application/validators/user'

import { makeUserDbRepository } from '../repositories'

export const makeValidateActiveAccount = (): ValidateActiveAccount => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateActiveAccount(userDbRepository)
}
