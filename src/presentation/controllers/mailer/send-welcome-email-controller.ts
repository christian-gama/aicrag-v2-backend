import { IUser } from '@/domain'
import { ValidationCodeProtocol } from '@/domain/helpers'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { AccountAlreadyActivatedError, MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendWelcomeValidator: ValidatorProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly validationCode: ValidationCodeProtocol,
    private readonly welcomeEmail: MailerServiceProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.sendWelcomeValidator.validate(data)

    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findUserByEmail(data.email)) as IUser

    if (user.settings.accountActivated) {
      return this.httpHelper.forbidden(new AccountAlreadyActivatedError())
    }

    if (
      user?.temporary.activationCodeExpiration &&
      user.temporary.activationCodeExpiration.getTime() < Date.now()
    ) {
      user = await this.generateNewActivationCode(user)
    }

    const mailerResponse = await this.welcomeEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${user.personal.email}`
    })
  }

  private async generateNewActivationCode (user: IUser): Promise<IUser> {
    const updatedUser = await this.userRepository.updateUser(user.personal.id, {
      'temporary.activationCode': this.validationCode.generate(),
      'temporary.activationCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })

    return updatedUser as IUser
  }
}
