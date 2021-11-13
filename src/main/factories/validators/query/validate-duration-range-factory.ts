import { ValidateDurationRange } from '@/application/validators/query'

export const makeValidateDurationRange = (): ValidateDurationRange => {
  return new ValidateDurationRange()
}
