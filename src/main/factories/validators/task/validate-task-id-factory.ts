import { ValidateTaskId } from '@/application/validators/task'

export const makeValidateTaskId = (): ValidateTaskId => {
  return new ValidateTaskId()
}
