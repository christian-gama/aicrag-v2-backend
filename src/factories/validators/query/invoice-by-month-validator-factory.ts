import { IValidator } from '@/domain/validators'

import { ValidationComposite } from '@/application/validators/validation-composite'

import {
  makeValidateFields,
  makeValidateLimit,
  makeValidateMonth,
  makeValidatePage,
  makeValidateSort,
  makeValidateTaskId,
  makeValidateType,
  makeValidateYear
} from '.'
import { makeRequiredFields } from '../validate-required-fields-factory'

export const makeInvoiceByMonthValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['month', 'type', 'year']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateFields())
  validations.push(makeValidateLimit())
  validations.push(makeValidateMonth())
  validations.push(makeValidatePage())
  validations.push(makeValidateSort())
  validations.push(makeValidateTaskId())
  validations.push(makeValidateType())
  validations.push(makeValidateYear())

  const getInvoiceByMonthValidator = new ValidationComposite(validations)

  return getInvoiceByMonthValidator
}
