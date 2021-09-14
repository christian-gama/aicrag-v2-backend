import { User } from '@/domain/user'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

export class ActivateAccountController implements ControllerProtocol {
  constructor (
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly activateAccountValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAdapter: EncrypterProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.activateAccountValidator.validate(credentials)
    if (error) return this.httpHelper.unauthorized(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as User

    const accessToken = this.jwtAdapter.encryptId(user.personal.id)

    const filteredUser = this.filterUserData.filter(user)

    await this.clearTemporary(user)
    await this.activateAccount(user)

    return this.httpHelper.ok({ user: filteredUser }, accessToken)
  }

  private async clearTemporary (user: User): Promise<void> {
    user.temporary.activationCode = null
    user.temporary.activationCodeExpiration = null

    await this.userDbRepository.updateUser(user, {
      'temporary.activationCode': user.temporary.activationCode,
      'temporary.activationCodeExpiration': user.temporary.activationCode
    })
  }

  private async activateAccount (user: User): Promise<void> {
    user.settings.accountActivated = true

    await this.userDbRepository.updateUser(user, {
      'settings.accountActivated': user.settings.accountActivated
    })
  }
}
