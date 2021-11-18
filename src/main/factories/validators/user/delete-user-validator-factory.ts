import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import { makeRequiredFields, makeValidateDeletePermission } from '.'
import { makeValidateUUID } from '../common'

export const makeDeleteUserValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['id']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateUUID())
  validations.push(makeValidateDeletePermission())

  return new ValidationComposite(validations)
}
