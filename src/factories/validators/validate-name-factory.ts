import { ValidateName } from '@/application/validators'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
