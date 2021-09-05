import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { MissingParamError } from '../../errors'

export class RequiredFields implements AccountValidator {
  constructor (private readonly field: string) {}

  validate (input: any): Error | undefined {
    if (!input[this.field]) return new MissingParamError(this.field)
  }
}
