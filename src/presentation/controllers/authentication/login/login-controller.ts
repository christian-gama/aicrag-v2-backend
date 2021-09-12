import { User } from '@/domain/user'
import { ControllerProtocol } from '.'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAdapter: EncrypterProtocol
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

    const user = (await this.accountDbRepository.findAccountByEmail(credentials.email)) as User

    const accessToken = this.jwtAdapter.encryptId(user.personal.id)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, accessToken })
  }
}