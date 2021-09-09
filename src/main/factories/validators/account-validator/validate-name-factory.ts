import { ValidateName } from '@/application/usecases/validators/account'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
