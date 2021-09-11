import { AccountRepository } from '@/application/usecases/repositories/account/'
import { makeBcryptAdapter } from '@/main/factories/cryptography/hasher-factory'
import { makeUuid } from '@/main/factories/helpers/uuid-factory'
import { makeValidationCode } from '@/main/factories/helpers/validation-code-factory'

export const makeAccountRepository = (): AccountRepository => {
  const activationCode = makeValidationCode()
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new AccountRepository(activationCode, hasher, uuid)
}
