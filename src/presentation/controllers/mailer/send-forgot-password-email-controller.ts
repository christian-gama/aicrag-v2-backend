import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendForgotPasswordEmailController implements ControllerProtocol {
  constructor (
    private readonly forgotPasswordEmail: MailerServiceProtocol,
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(data)

    if (error != null) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(data.email)) as IUser

    const mailerResponse = await this.forgotPasswordEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `Instructions to reset your password were sent to ${user.personal.email}`
    })
  }
}
