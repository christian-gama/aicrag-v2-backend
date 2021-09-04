import { InvalidParamError } from '@/infra/errors'
import { AccountValidator } from '@/application/validators/account/account-validator-protocol'

export class ValidateName implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
