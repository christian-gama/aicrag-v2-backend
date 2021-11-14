import { IComparer } from '@/domain/cryptography'
import { IValidator } from '@/domain/validators'
import { InvalidTypeError, UserCredentialError } from '../../errors'

export class ValidateCurrentPassword implements IValidator {
  constructor (private readonly hasher: IComparer) {}

  async validate (input: Record<string, any>): Promise<InvalidTypeError | UserCredentialError | undefined> {
    const { currentPassword, user } = input

    if (!currentPassword) return

    if (typeof currentPassword !== 'string') {
      return new InvalidTypeError('currentPassword', 'string', typeof currentPassword)
    }

    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(currentPassword, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
