import { ValidatePasswordComparasion } from '@/application/validators/user'

export const makeValidatePasswordComparasion = (): ValidatePasswordComparasion => {
  return new ValidatePasswordComparasion()
}
