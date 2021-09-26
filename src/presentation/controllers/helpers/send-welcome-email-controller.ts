import { IUser } from '@/domain'

import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { AccountAlreadyActivatedError, MailerServiceError } from '@/application/usecases/errors'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendWelcomeValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly welcomeEmail: MailerServiceProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.sendWelcomeValidator.validate(credentials)

    if (error) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    if (user.settings.accountActivated) return this.httpHelper.forbidden(new AccountAlreadyActivatedError())

    const mailerResponse = await this.welcomeEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${user.personal.email}`
    })
  }
}
