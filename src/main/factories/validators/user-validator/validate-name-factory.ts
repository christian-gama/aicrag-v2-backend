import { ValidateName } from '@/application/usecases/validators'

export const makeValidateName = (): ValidateName => {
  return new ValidateName()
}
