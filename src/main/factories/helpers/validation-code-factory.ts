import { ValidationCode } from '@/application/usecases/helpers/validation-code/validation-code'

export const makeValidationCode = (): ValidationCode => {
  return new ValidationCode()
}
