import { ValidateActiveAccount } from '@/application/validators'

import { makeUserDbRepository } from '../repositories'

export const makeValidateActiveAccount = (): ValidateActiveAccount => {
  const userDbRepository = makeUserDbRepository()

  return new ValidateActiveAccount(userDbRepository)
}
