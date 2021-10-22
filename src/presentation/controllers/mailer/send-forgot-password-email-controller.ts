import { IUser } from '@/domain'
import { MailerServiceProtocol } from '@/domain/mailer'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MailerServiceError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendForgotPasswordEmailController implements ControllerProtocol {
  constructor (
    private readonly forgotPasswordEmail: MailerServiceProtocol,
    private readonly forgotPasswordEmailValidator: ValidatorProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly verifyResetPasswordToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.forgotPasswordEmailValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findUserByEmail(data.email)) as IUser

    const decoded = await this.verifyResetPasswordToken.verify(user.temporary.resetPasswordToken)
    if (decoded instanceof Error) {
      user = await this.generateNewResetPasswordToken(user)
    }

    const mailerResponse = await this.forgotPasswordEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    return this.httpHelper.ok({
      message: `Instructions to reset your password were sent to ${user.personal.email}`
    })
  }

  private async generateNewResetPasswordToken (user: IUser): Promise<IUser> {
    const updatedUser = await this.userRepository.updateUser(user.personal.id, {
      'temporary.resetPasswordToken': await this.generateAccessToken.generate(user)
    })

    return updatedUser as IUser
  }
}
