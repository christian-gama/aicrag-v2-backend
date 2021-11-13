import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import { makeValidateCurrency, makeValidateEmail, makeValidateEmailAlreadyExists, makeValidateName } from '.'

export const makeUpdateMeValidator = (): IValidator => {
  const validations: IValidator[] = []

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailAlreadyExists())
  validations.push(makeValidateName())
  validations.push(makeValidateCurrency())

  return new ValidationComposite(validations)
}
