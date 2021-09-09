import { AccountRepository } from '@/application/usecases/repositories/account/account-repository'
import { makeBcryptAdapter } from '../../cryptography/hasher-factory'
import { makeUuid } from '../../helpers/uuid-factory'
import { makeValidationCode } from '../../helpers/validation-code-factory'

export const makeAccountRepository = (): AccountRepository => {
  const hasher = makeBcryptAdapter()
  const activationCode = makeValidationCode()
  const uuid = makeUuid()

  return new AccountRepository(hasher, activationCode, uuid)
}
