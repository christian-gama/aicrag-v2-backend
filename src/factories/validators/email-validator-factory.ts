import { EmailValidatorProtocol } from '@/domain/validators'

import { ValidatorAdapter } from '@/infra/adapters/validators'

export const makeEmailValidator = (): EmailValidatorProtocol => {
  return new ValidatorAdapter()
}
