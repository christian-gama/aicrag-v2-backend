import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import { makeValidateFields, makeValidateLimit, makeValidatePage, makeValidateSort, makeValidateType } from '.'
import { makeRequiredFields } from '../validate-required-fields-factory'

export const makeAllInvoicesValidator = (): IValidator => {
  const validations: IValidator[] = []

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

  const getInvoiceByMonthValidator = new ValidationComposite(validations)

  return getInvoiceByMonthValidator
}
