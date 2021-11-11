import { ValidateQuery } from '@/application/validators/query'

export const makeValidateQuery = (field: string): ValidateQuery => {
  return new ValidateQuery(field)
}
