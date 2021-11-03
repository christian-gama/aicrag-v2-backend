import { ValidateEmailPin } from '@/application/validators/user'

export const makeValidateEmailPin = (): ValidateEmailPin => {
  return new ValidateEmailPin()
}
