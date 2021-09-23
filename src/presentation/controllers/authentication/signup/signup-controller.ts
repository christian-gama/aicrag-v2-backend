import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import {
  ConflictParamError,
  MailerServiceError,
  MustLogoutError
} from '@/application/usecases/errors/'
import { MailerServiceProtocol } from '@/application/protocols/mailer'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '.'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly userValidator: ValidatorProtocol,
    private readonly welcomeEmail: MailerServiceProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const signUpUserCredentials = httpRequest.body

    if (httpRequest.user) return this.httpHelper.badRequest(new MustLogoutError())

    const error = await this.userValidator.validate(signUpUserCredentials)

    const emailExists = await this.userDbRepository.findUserByEmail(signUpUserCredentials.email)

    if (emailExists) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const user = await this.userDbRepository.saveUser(signUpUserCredentials)

    const accessToken = this.generateAccessToken.generate(user) as string

    const mailerResponse = await this.welcomeEmail.send(user)

    if (mailerResponse instanceof MailerServiceError) {
      return this.httpHelper.serverError(mailerResponse)
    }

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, accessToken })
  }
}
