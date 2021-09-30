import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendEmailCodeController implements ControllerProtocol {
  constructor (
    private readonly emailCode: MailerServiceProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendEmailCodeValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.sendEmailCodeValidator.validate(credentials)

    if (error != null) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    const mailerResponse = await this.emailCode.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `An email with your code has been sent to ${user.temporary.tempEmail as string}`
    })
  }
}
