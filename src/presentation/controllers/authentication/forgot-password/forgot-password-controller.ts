import { IUser } from '@/domain/user'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../login'
import { MailerServiceProtocol } from '@/application/protocols/services/mailer/mailer-service-protocol'

export class ForgotPasswordController implements ControllerProtocol {
  constructor (
    private readonly forgotPasswordEmail: MailerServiceProtocol,
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(email)

    if (error) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(email)) as IUser

    const resetPasswordToken = this.jwtAccessToken.encrypt({
      email: user.personal.email,
      id: user.personal.id
    })

    await this.userDbRepository.updateUser(user, {
      'temporary.resetPasswordToken': resetPasswordToken
    })

    await this.forgotPasswordEmail.send(user)

    return this.httpHelper.ok({})
  }
}
