import { ValidateType } from '@/application/validators/task'

export const makeValidateType = (): ValidateType => {
  return new ValidateType()
}
