import { ValidateYear } from '@/application/validators/query'

export const makeValidateYear = (): ValidateYear => {
  return new ValidateYear()
}
