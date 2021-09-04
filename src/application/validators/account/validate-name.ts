import { InvalidParamError } from '@/application/errors'
import { AccountValidator } from '@/domain/validators/account-validator-protocol'

export class ValidateName implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}
