import { ValidateTypeFilter } from '@/application/validators/query'

export const makeValidateTypeFilter = (): ValidateTypeFilter => {
  return new ValidateTypeFilter()
}
