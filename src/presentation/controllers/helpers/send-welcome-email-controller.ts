import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { AccountAlreadyActivatedError, MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendWelcomeValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly welcomeEmail: MailerServiceProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.sendWelcomeValidator.validate(data)

    if (error != null) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(data.email)) as IUser

    if (user.settings.accountActivated) { return this.httpHelper.forbidden(new AccountAlreadyActivatedError()) }

    const mailerResponse = await this.welcomeEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${user.personal.email}`
    })
  }
}
