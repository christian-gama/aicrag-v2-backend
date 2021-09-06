import { Uuid } from '@/application/usecases/helpers/uuid/uuid'
import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'
import { AccountRepository } from '@/application/usecases/repositories/account/account-repository'
import { BcryptAdapter } from '@/infra/adapters/cryptography/bcrypt/bcrypt-adapter'

export const makeAccountRepository = (): AccountRepository => {
  const salt = 12
  const hasher = new BcryptAdapter(salt)
  const activationCode = new ValidationCode()
  const uuid = new Uuid()

  return new AccountRepository(hasher, activationCode, uuid)
}
