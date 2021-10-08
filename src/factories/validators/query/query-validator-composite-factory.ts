import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeValidateFields } from './validate-fields-factory'
import { makeValidateLimit } from './validate-limit-factory'
import { makeValidatePage } from './validate-page-factory'
import { makeValidateSort } from './validate-sort-factory'

export const makeQueryValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateLimit())
  validations.push(makeValidatePage())
  validations.push(makeValidateSort())

  const queryValidatorComposite = new ValidationComposite(validations)

  return queryValidatorComposite
}
