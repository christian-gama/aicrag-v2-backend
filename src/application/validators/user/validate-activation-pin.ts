import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { InvalidPinError, AccountAlreadyActivatedError, PinIsExpiredError, InvalidTypeError } from '../../errors'

export class ValidateActivationPin implements IValidator {
  constructor (private readonly userRepository: IUserRepository) {}

  async validate (
    input: any
  ): Promise<AccountAlreadyActivatedError | PinIsExpiredError | InvalidPinError | InvalidTypeError | undefined> {
    const { email, activationPin } = input

    if (typeof activationPin !== 'string') return new InvalidTypeError('activationPin')

    const user = await this.userRepository.findByEmail(email)
    if (!user) return new InvalidPinError()

    if (user.temporary.activationPinExpiration == null) return new InvalidPinError()
    if (activationPin !== user.temporary.activationPin) return new InvalidPinError()
    if (user.settings.accountActivated) return new AccountAlreadyActivatedError()
    if (user.temporary.activationPinExpiration.getTime() < Date.now()) {
      return new PinIsExpiredError()
    }
  }
}
