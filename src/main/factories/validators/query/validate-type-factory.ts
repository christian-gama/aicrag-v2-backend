import { ValidateType } from '@/application/validators/query'

export const makeValidateType = (): ValidateType => {
  return new ValidateType()
}
