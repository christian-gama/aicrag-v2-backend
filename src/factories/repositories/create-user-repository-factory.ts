import { CreateUserRepository } from '@/application/repositories'

import { makeBcryptAdapter } from '@/factories/cryptography'
import { makeUuid, makePin } from '@/factories/helpers'

export const makeCreateUserRepository = (): CreateUserRepository => {
  const activationPin = makePin()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new CreateUserRepository(activationPin, hasher, uuid)
}
