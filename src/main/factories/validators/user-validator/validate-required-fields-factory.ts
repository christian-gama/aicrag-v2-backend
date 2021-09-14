import { ValidateRequiredFields } from '@/application/usecases/validators/user-validator'

export const makeRequiredFields = (field: string): ValidateRequiredFields => {
  return new ValidateRequiredFields(field)
}
