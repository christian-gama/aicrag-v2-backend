import { IUser } from '@/domain'
import { IMailerService } from '@/domain/mailer'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class SendForgotPasswordEmailController implements IController {
  constructor (
    private readonly forgotPasswordEmail: IMailerService,
    private readonly forgotPasswordEmailValidator: IValidator,
    private readonly generateAccessToken: IGenerateToken,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository,
    private readonly verifyResetPasswordToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.forgotPasswordEmailValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findByEmail(data.email)) as IUser

    const decoded = await this.verifyResetPasswordToken.verify(user.temporary.resetPasswordToken)
    if (decoded instanceof Error) {
      user = await this.generateNewResetPasswordToken(user)
    }

    const mailerResponse = await this.forgotPasswordEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    const result = this.httpHelper.ok({
      message: `Instructions to reset your password were sent to ${user.personal.email}`
    })

    return result
  }

  private async generateNewResetPasswordToken (user: IUser): Promise<IUser> {
    const result = await this.userRepository.updateById(user.personal.id, {
      'temporary.resetPasswordToken': await this.generateAccessToken.generate(user)
    })

    return result as IUser
  }
}
