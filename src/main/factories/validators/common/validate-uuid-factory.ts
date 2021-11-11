import { ValidateUUID } from '@/application/validators/task'

export const makeValidateUUID = (): ValidateUUID => {
  return new ValidateUUID()
}
