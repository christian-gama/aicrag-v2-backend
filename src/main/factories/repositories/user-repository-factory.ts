import { UserRepository } from '@/application/usecases/repositories'

import { makeBcryptAdapter } from '@/main/factories/cryptography'
import { makeUuid, makeValidationCode } from '@/main/factories/helpers'

export const makeUserRepository = (): UserRepository => {
  const activationCode = makeValidationCode()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new UserRepository(activationCode, hasher, uuid)
}
