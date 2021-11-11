import { ValidateRole } from '@/application/validators/query'

export const makeValidateRole = (): ValidateRole => {
  return new ValidateRole()
}
