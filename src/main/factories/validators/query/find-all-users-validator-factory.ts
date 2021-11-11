import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/validation-composite'
import {
  makeValidateEmail,
  makeValidateFields,
  makeValidateLimit,
  makeValidateName,
  makeValidatePage,
  makeValidateRole,
  makeValidateSort
} from '.'

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
