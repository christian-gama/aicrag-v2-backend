import { ValidateTokenVersion } from '@/application/validators/user'

export const makeValidateTokenVersion = (): ValidateTokenVersion => {
  return new ValidateTokenVersion()
}
