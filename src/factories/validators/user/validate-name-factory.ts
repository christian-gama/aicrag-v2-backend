import { ValidateName } from '@/application/validators/user'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
