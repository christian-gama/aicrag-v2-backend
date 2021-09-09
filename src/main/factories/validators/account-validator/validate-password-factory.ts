import { ValidatePassword } from '@/application/usecases/validators/account'

export const makeValidatePassword = (): ValidatePassword => {
  return new ValidatePassword()
}
