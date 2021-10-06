import { ValidateTaskParam } from '@/application/validators/task'

export const makeValidateTaskParam = (): ValidateTaskParam => {
  return new ValidateTaskParam()
}
