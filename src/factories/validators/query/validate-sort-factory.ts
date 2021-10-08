import { ValidateSort } from '@/application/validators/query'

export const makeValidateSort = (): ValidateSort => {
  return new ValidateSort()
}
