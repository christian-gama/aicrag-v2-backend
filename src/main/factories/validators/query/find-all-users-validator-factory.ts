import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/validation-composite'
import { makeValidateFields, makeValidateLimit, makeValidatePage, makeValidateSort } from '.'
import { makeValidateEmail, makeValidateName } from '../user'
import { makeValidateRole } from './validate-role-factory'

export const makeFindAllUsersValidator = (): IValidator => {
  const validations: IValidator[] = []

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateSort())
  validations.push(makeValidateLimit())
  validations.push(makeValidatePage())
  validations.push(makeValidateRole())
  validations.push(makeValidateEmail())
  validations.push(makeValidateName())

  return new ValidationComposite(validations)
}
