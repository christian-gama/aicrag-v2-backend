import { IComparer } from '@/domain/cryptography'
import { IValidator } from '@/domain/validators'
import { UserCredentialError } from '../../errors'

export class ValidateCurrentPassword implements IValidator {
  constructor (private readonly hasher: IComparer) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { currentPassword, user } = input

    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(currentPassword, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
