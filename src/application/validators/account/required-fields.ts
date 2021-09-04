import { MissingParamError } from '@/application/errors'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class RequiredFields implements AccountValidator {
  constructor (private readonly field: string) {}

  validate (input: any): Error | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
