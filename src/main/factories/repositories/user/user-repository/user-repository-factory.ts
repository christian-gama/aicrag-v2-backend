import { UserRepository } from '@/application/usecases/repositories/user'
import { makeBcryptAdapter } from '@/main/factories/cryptography/hasher-factory'
import { makeUuid } from '@/main/factories/helpers/uuid-factory'
import { makeValidationCode } from '@/main/factories/helpers/validation-code-factory'

export const makeUserRepository = (): UserRepository => {
  const activationCode = makeValidationCode()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new UserRepository(activationCode, hasher, uuid)
}
