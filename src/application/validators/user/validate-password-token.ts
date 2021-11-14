import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InvalidTypeError, MissingParamError, UserCredentialError } from '../../errors'

export class ValidatePasswordToken implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (input: Record<string, any>): Promise<InvalidTypeError | UserCredentialError | undefined> {
    const { email } = input

    if (!email) return

    if (typeof email !== 'string') {
      return new InvalidTypeError('email', 'string', typeof email)
    }

    const user = await this.userRepository.findByEmail(email)
    if (!user?.temporary.resetPasswordToken) return new MissingParamError('resetPasswordToken')
  }
}
