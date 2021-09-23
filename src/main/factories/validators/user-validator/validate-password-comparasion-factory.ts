import { ValidatePasswordComparasion } from '@/application/usecases/validators'

export const makeValidatePasswordComparasion = (): ValidatePasswordComparasion => {
  return new ValidatePasswordComparasion()
}
