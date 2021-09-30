import { ValidationCode } from '@/application/helpers/validation-code'

export const makeValidationCode = (): ValidationCode => {
  return new ValidationCode()
}
