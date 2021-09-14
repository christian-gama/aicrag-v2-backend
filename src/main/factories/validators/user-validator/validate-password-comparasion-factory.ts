import { ValidatePasswordComparasion } from '@/application/usecases/validators/user-validator'

export const makeValidatePasswordComparasion = (): ValidatePasswordComparasion => {
  return new ValidatePasswordComparasion()
}
