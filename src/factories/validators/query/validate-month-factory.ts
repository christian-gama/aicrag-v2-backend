import { ValidateMonth } from '@/application/validators/query'

export const makeValidateMonth = (): ValidateMonth => {
  return new ValidateMonth()
}
