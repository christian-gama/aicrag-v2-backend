import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import { makeRequiredFields } from '.'
import { makeValidateUUID } from '../common'

export const makeDeleteUserValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['id']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateUUID())

  return new ValidationComposite(validations)
}
