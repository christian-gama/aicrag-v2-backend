import { ValidatePassword } from '@/application/validators'

export const makeValidatePassword = (): ValidatePassword => {
  return new ValidatePassword()
}
