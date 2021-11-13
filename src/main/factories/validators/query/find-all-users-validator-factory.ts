import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/validation-composite'
import { makeValidateFields, makeValidateLimit, makeValidatePage, makeValidateSort, makeValidateQuery } from '.'
import { makeValidateRole } from '../user'

export const makeFindAllUsersValidator = (): IValidator => {
  const validations: IValidator[] = []

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateSort())
  validations.push(makeValidateLimit())
  validations.push(makeValidatePage())
  validations.push(makeValidateRole())

  const fields = ['email', 'name', 'id']
  for (const field of fields) {
    validations.push(makeValidateQuery(field))
  }

  return new ValidationComposite(validations)
}
