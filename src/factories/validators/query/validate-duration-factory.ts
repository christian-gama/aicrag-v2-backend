import { ValidateDuration } from '@/application/validators/query'

export const makeValidateDuration = (): ValidateDuration => {
  return new ValidateDuration()
}
