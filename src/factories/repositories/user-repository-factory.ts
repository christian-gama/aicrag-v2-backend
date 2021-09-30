import { UserRepository } from '@/application/repositories'

import { makeBcryptAdapter } from '@/factories/cryptography'
import { makeUuid, makeValidationCode } from '@/factories/helpers'

export const makeUserRepository = (): UserRepository => {
  const activationCode = makeValidationCode()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new UserRepository(activationCode, hasher, uuid)
}
