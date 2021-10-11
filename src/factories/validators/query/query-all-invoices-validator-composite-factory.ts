import { ValidatorProtocol } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import {
  makeValidateFields,
  makeValidateLimit,
  makeValidatePage,
  makeValidateSort,
  makeValidateType
} from '.'
import { makeRequiredFields } from '../validate-required-fields-factory'

export const makeQueryAllInvoicesValidatorComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['type']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateLimit())
  validations.push(makeValidateType())
  validations.push(makeValidatePage())
  validations.push(makeValidateSort())

  const queryInvoiceValidatorComposite = new ValidationComposite(validations)

  return queryInvoiceValidatorComposite
}