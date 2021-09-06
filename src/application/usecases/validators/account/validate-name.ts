import { AccountValidator } from '@/application/protocols/validators/account/account-validator-protocol'
import { InvalidParamError } from '../../errors'

export class ValidateName implements AccountValidator {
  validate (input: any): Error | undefined {
    if (input.name.match(/[^a-zA-Z .']/g)) return new InvalidParamError('name')
  }
}