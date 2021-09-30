import { ValidateRequiredFields } from '@/application/validators'

export const makeRequiredFields = (field: string): ValidateRequiredFields => {
  return new ValidateRequiredFields(field)
}
