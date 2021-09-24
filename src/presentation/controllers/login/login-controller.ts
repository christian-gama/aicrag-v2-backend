import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'
import { IUser } from '@/domain'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const credentials = httpRequest.body

    const error = await this.credentialsValidator.validate(credentials)

    if (error?.name === 'InvalidParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'MissingParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'UserCredentialError') return this.httpHelper.unauthorized(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    const accessToken = this.generateAccessToken.generate(user) as string

    if (error?.name === 'InactiveAccountError') {
      return this.httpHelper.ok({
        message: error.message,
        accessToken
      })
    }

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({
      user: filteredUser,
      refreshToken,
      accessToken
    })
  }
}
