import { ComparerProtocol } from '@/domain/cryptography'
import { ValidatorProtocol } from '@/domain/validators'

import { UserCredentialError } from '../../errors'

export class ValidateCurrentPassword implements ValidatorProtocol {
  constructor (
    private readonly hasher: ComparerProtocol
  ) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { currentPassword, user } = input

    if (!user) return new UserCredentialError()

    const isSamePassword = await this.hasher.compare(currentPassword, user.personal.password)
    if (!isSamePassword) return new UserCredentialError()
  }
}
