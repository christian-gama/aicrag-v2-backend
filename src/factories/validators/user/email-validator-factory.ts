import { IEmailValidator } from '@/domain/validators'

import { ValidatorAdapter } from '@/infra/adapters/validators'

export const makeEmailValidator = (): IEmailValidator => {
  return new ValidatorAdapter()
}
