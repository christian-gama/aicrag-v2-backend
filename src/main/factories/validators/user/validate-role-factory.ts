import { ValidateRole } from '@/application/validators/user'

export const makeValidateRole = (): ValidateRole => {
  return new ValidateRole()
}
