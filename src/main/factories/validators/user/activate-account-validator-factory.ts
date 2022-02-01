import { IValidator } from '@/domain/validators'
import { ValidationComposite } from '@/application/validators/user'
import { makeRequiredFields, makeValidateActivationPin } from '.'

export const makeActivateAccountValidator = (): IValidator => {
  const validations: IValidator[] = []

  const fields = ['userId', 'activationPin']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  validations.push(makeValidateActivationPin())

  return new ValidationComposite(validations)
}
