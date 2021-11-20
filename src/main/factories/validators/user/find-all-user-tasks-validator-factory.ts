import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import { makeRequiredFields } from '.'

export const makeFindAllUserTasksValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['userId']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  return new ValidationComposite(validations)
}
