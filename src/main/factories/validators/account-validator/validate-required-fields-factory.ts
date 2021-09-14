import { ValidateRequiredFields } from '@/application/usecases/validators/account'

export const makeRequiredFields = (field: string): ValidateRequiredFields => {
  return new ValidateRequiredFields(field)
}
