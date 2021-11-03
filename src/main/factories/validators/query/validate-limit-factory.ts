import { ValidateLimit } from '@/application/validators/query'

export const makeValidateLimit = (): ValidateLimit => {
  return new ValidateLimit()
}
