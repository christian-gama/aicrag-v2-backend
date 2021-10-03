import { ValidateCommentary } from '@/application/validators/task'

export const makeValidateCommentary = (): ValidateCommentary => {
  return new ValidateCommentary()
}
