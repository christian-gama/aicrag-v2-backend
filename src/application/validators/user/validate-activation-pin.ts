import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InvalidPinError, AccountAlreadyActivatedError, PinIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateActivationPin implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (
    input: Record<string, any>
  ): Promise<AccountAlreadyActivatedError | PinIsExpiredError | InvalidPinError | InvalidTypeError | undefined> {
    const { email, activationPin } = input

    if (!activationPin || !email) return

    if (typeof activationPin !== 'string') return new InvalidTypeError('activationPin', 'string', typeof activationPin)

    const user = await this.userRepository.findByEmail(email)
    if (!user) return new InvalidPinError()

    const { accountActivated } = user.settings
    const { activationPinExpiration, activationPin: tempActivationPin } = user.temporary

    if (!activationPinExpiration) return new InvalidPinError()
    if (activationPin !== tempActivationPin) return new InvalidPinError()
    if (accountActivated) return new AccountAlreadyActivatedError()
    if (activationPinExpiration.getTime() < Date.now()) {
      return new PinIsExpiredError()
    }
  }
}
