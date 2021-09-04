import { MissingParamError } from '@/infra/errors'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export class RequiredFields implements AccountValidator {
  constructor (private readonly field: string) {}

  validate (input: any): Error | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
