import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MissingParamError, UserCredentialError } from '../../errors'

export class ValidatePasswordToken implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: any): Promise<UserCredentialError | undefined> {
    const { email } = input

    const user = await this.userRepository.findByEmail(email)
    if (!user?.temporary.resetPasswordToken) return new MissingParamError('resetPasswordToken')
  }
}
