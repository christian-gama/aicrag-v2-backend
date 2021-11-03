import { ValidatePage } from '@/application/validators/query'

export const makeValidatePage = (): ValidatePage => {
  return new ValidatePage()
}
