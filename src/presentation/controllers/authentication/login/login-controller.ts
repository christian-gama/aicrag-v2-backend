import { User } from '@/domain/user'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '.'
import { GenerateTokenProtocol } from '@/application/protocols/providers/generate-token-protocol'

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
    const credentials = httpRequest.body

    const error = await this.credentialsValidator.validate(credentials)

    if (error) {
      let response: HttpResponse
      switch (error.name) {
        case 'InvalidParamError':
          response = this.httpHelper.badRequest(error)
          break
        case 'MissingParamError':
          response = this.httpHelper.badRequest(error)
          break
        case 'UserCredentialError':
          response = this.httpHelper.unauthorized(error)
          break
        default:
          response = this.httpHelper.forbidden(error)
      }

      return response
    }

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as User

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({
      user: filteredUser,
      refreshToken,
      accessToken
    })
  }
}
