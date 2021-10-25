import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeValidateFields } from './validate-fields-factory'
import { makeValidateLimit } from './validate-limit-factory'
import { makeValidatePage } from './validate-page-factory'
import { makeValidateSort } from './validate-sort-factory'

export const makeQueryValidator = (): IValidator => {
  const validations: IValidator[] = []

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateLimit())
  validations.push(makeValidatePage())
  validations.push(makeValidateSort())

  return new ValidationComposite(validations)
}
