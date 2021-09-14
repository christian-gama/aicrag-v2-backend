import { ValidatePassword } from '@/application/usecases/validators/user-validator'

export const makeValidatePassword = (): ValidatePassword => {
  return new ValidatePassword()
}
