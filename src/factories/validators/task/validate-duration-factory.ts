import { ValidateDuration } from '@/application/validators/task'

export const makeValidateDuration = (): ValidateDuration => {
  return new ValidateDuration()
}
