import { ValidateTaskId } from '@/application/validators/query'

export const makeValidateTaskId = (): ValidateTaskId => {
  return new ValidateTaskId()
}
