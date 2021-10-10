import { CreateUserRepository } from '@/application/repositories'

import { makeBcryptAdapter } from '@/factories/cryptography'
import { makeUuid, makeValidationCode } from '@/factories/helpers'

export const makeCreateUserRepository = (): CreateUserRepository => {
  const activationCode = makeValidationCode()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new CreateUserRepository(activationCode, hasher, uuid)
}
