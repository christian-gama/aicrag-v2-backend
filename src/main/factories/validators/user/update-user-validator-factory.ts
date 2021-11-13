import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import {
  makeValidateActiveAccount,
  makeValidateEmail,
  makeValidateEmailAlreadyExists,
  makeValidateHandicap,
  makeValidateName,
  makeValidateRole
} from '.'
import { makeValidateTokenVersion } from './validate-token-version-factory'

export const makeUpdateUserValidator = (): IValidator => {
  const validations: IValidator[] = []

  // Must have this exact validation order
  validations.push(makeValidateActiveAccount())
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailAlreadyExists())
  validations.push(makeValidateHandicap())
  validations.push(makeValidateName())
  validations.push(makeValidateRole())
  validations.push(makeValidateTokenVersion())

  return new ValidationComposite(validations)
}
