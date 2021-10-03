import { ValidateCurrency } from '@/application/validators/user'

export const makeValidateCurrency = (): ValidateCurrency => {
  return new ValidateCurrency()
}
