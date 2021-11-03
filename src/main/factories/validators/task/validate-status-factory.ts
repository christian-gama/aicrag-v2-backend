import { ValidateStatus } from '@/application/validators/task'

export const makeValidateStatus = (): ValidateStatus => {
  return new ValidateStatus()
}
