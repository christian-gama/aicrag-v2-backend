import { ValidateName } from '@/application/usecases/validators/user-validator'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
