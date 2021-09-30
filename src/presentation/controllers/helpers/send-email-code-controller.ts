import { IUser } from '@/domain'

import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MailerServiceError } from '@/application/usecases/errors'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

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
      message: `An email with your code has been sent to ${user.personal.email}`
    })
  }
}
