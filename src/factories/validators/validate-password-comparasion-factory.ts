import { ValidatePasswordComparasion } from '@/application/validators'

export const makeValidatePasswordComparasion = (): ValidatePasswordComparasion => {
  return new ValidatePasswordComparasion()
}
