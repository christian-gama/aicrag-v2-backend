import { ValidatePassword } from '@/application/usecases/validators'

export const makeValidatePassword = (): ValidatePassword => {
  return new ValidatePassword()
}
