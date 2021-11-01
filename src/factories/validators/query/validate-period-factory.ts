import { ValidatePeriod } from '@/application/validators/query'

export const makeValidatePeriod = (): ValidatePeriod => {
  return new ValidatePeriod()
}
