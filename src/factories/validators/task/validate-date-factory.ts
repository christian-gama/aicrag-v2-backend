import { ValidateDate } from '@/application/validators/task'

export const makeValidateDate = (): ValidateDate => {
  return new ValidateDate()
}
