import { ValidatePasswordComparison } from '@/application/validators/user'

export const makeValidatePasswordComparison = (): ValidatePasswordComparison => {
  return new ValidatePasswordComparison()
}
