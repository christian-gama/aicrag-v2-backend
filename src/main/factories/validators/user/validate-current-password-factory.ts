import { ValidateCurrentPassword } from '@/application/validators/user'
import { makeBcryptAdapter } from '../../cryptography'

export const makeValidateCurrentPassword = (): ValidateCurrentPassword => {
  const hasher = makeBcryptAdapter()

  return new ValidateCurrentPassword(hasher)
}
