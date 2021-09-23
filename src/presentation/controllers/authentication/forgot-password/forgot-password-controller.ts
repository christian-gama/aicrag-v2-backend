import { IUser } from '@/domain'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../login'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

export class ForgotPasswordController implements ControllerProtocol {
  constructor (
    private readonly forgotPasswordEmail: MailerServiceProtocol,
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credential = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(credential)

    if (error) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credential.email)) as IUser

    const resetPasswordToken = this.generateAccessToken.generate(user) as string

    await this.userDbRepository.updateUser(user, {
      'temporary.resetPasswordToken': resetPasswordToken
    })

    await this.forgotPasswordEmail.send(user)

    return this.httpHelper.ok({
      message: `Instructions to reset your password were sent to ${user.personal.email}`
    })
  }
}
