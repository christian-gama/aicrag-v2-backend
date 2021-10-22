import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MissingParamError, UserCredentialError } from '../../errors'

export class ValidatePasswordToken implements ValidatorProtocol {
  constructor (private readonly userRepository: UserRepositoryProtocol) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userRepository.findUserByEmail(email)

    if (!user?.temporary.resetPasswordToken) return new MissingParamError('resetPasswordToken')
  }
}
