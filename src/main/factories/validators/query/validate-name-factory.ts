import { ValidateName } from '@/application/validators/query'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
