import { ValidateCurrency } from '@/application/validators'

export const makeValidateCurrency = (): ValidateCurrency => {
  return new ValidateCurrency()
}
