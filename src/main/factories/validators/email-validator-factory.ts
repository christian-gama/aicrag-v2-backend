import { EmailValidatorProtocol } from '@/application/protocols/validators'

import { ValidatorAdapter } from '@/infra/adapters/validators'

export const makeEmailValidator = (): EmailValidatorProtocol => {
  return new ValidatorAdapter()
}
