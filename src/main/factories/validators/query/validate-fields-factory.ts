import { ValidateFields } from '@/application/validators/query'

export const makeValidateFields = (): ValidateFields => {
  return new ValidateFields()
}
