import { ValidateRequiredFields } from '@/application/validators/user'

export const makeRequiredFields = (field: string): ValidateRequiredFields => {
  return new ValidateRequiredFields(field)
}
