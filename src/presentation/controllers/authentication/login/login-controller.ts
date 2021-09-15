import { User } from '@/domain/user'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '.'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol,
    private readonly jwtRefreshToken: EncrypterProtocol,
    private readonly refreshTokenDbRepository: RefreshTokenDbRepositoryProtocol,
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

    const accessToken = this.jwtAccessToken.encrypt('id', user.personal.id)

    const refreshTokenDb = await this.refreshTokenDbRepository.saveRefreshToken(user.personal.id)

    const refreshToken = this.jwtRefreshToken.encrypt('id', refreshTokenDb.id)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, refreshToken, accessToken })
  }
}
