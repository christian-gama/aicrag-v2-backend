import { ValidateHandicap } from '@/application/validators/user'

export const makeValidateHandicap = (): ValidateHandicap => {
  return new ValidateHandicap()
}
