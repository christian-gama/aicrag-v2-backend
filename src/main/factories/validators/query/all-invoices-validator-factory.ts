import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/validation-composite'
import { makeValidateFields, makeValidateLimit, makeValidatePage, makeValidateSort, makeValidateTypeFilter } from '.'
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
  validations.push(makeValidateTypeFilter())
  validations.push(makeValidatePage())
  validations.push(makeValidateSort())

  return new ValidationComposite(validations)
}
