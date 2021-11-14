import { IValidator } from '@/domain/validators'
import { InactiveAccountError, InvalidParamError, InvalidTypeError } from '../../errors'

export class ValidateAccountStatus implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InactiveAccountError | undefined> {
    const { accountStatus } = input

    if (!accountStatus) return

    if (typeof accountStatus !== 'string') return new InvalidTypeError('accountStatus', 'string', typeof accountStatus)

    const statuses = ['active', 'inactive']
    if (!statuses.includes(accountStatus)) return new InvalidParamError('accountStatus')
  }
}
