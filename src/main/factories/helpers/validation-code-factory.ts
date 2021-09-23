import { ValidationCode } from '@/application/usecases/helpers/validation-code'

export const makeValidationCode = (): ValidationCode => {
  return new ValidationCode()
}
