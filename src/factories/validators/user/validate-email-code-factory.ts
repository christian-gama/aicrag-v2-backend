import { ValidateEmailCode } from '@/application/validators/user'

export const makeValidateEmailCode = (): ValidateEmailCode => {
  return new ValidateEmailCode()
}
