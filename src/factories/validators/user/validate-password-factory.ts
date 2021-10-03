import { ValidatePassword } from '@/application/validators/user'

export const makeValidatePassword = (): ValidatePassword => {
  return new ValidatePassword()
}
