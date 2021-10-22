import { IUser } from '@/domain'
import { ValidationCodeProtocol } from '@/domain/helpers'
import { MailerServiceProtocol } from '@/domain/mailer'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendEmailCodeController implements ControllerProtocol {
  constructor (
    private readonly emailCode: MailerServiceProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendEmailCodeValidator: ValidatorProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly validationCode: ValidationCodeProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.sendEmailCodeValidator.validate(data)

    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findUserByEmail(data.email)) as IUser

    if (
      user?.temporary.tempEmailCodeExpiration &&
      user.temporary.tempEmailCodeExpiration.getTime() < Date.now()
    ) {
      user = await this.generateNewEmailCode(user)
    }

    const mailerResponse = await this.emailCode.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `An email with your code has been sent to ${user.temporary.tempEmail as string}`
    })
  }

  private async generateNewEmailCode (user: IUser): Promise<IUser> {
    const updatedUser = await this.userRepository.updateUser(user.personal.id, {
      'temporary.tempEmailCode': this.validationCode.generate(),
      'temporary.tempEmailCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
    })

    return updatedUser as IUser
  }
}
