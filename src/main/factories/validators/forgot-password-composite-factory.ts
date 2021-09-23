import { ValidatorProtocol } from '@/application/protocols/validators'
import { ValidationComposite } from '@/application/usecases/validators'
import { makeRequiredFields, makeValidateEmail, makeValidateEmailExists } from '.'

export const makeForgotPasswordComposite = (): ValidatorProtocol => {
  const validations: ValidatorProtocol[] = []

  const fields = ['email']
  for (const field of fields) {
    validations.push(makeRequiredFields(field))
  }

  // Must have this exact validation order
  validations.push(makeValidateEmail())
  validations.push(makeValidateEmailExists())

  const forgotPasswordComposite = new ValidationComposite(validations)

  return forgotPasswordComposite
}
