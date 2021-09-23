import { ValidateRequiredFields } from '@/application/usecases/validators'

export const makeRequiredFields = (field: string): ValidateRequiredFields => {
  return new ValidateRequiredFields(field)
}
