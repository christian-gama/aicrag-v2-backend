import { ValidatePasswordComparasion } from '@/application/usecases/validators/account'

export const makeComparePasswords = (): ValidatePasswordComparasion => {
  return new ValidatePasswordComparasion()
}
