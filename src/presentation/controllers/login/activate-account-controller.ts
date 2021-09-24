import { IUser } from '@/domain'

import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class ActivateAccountController implements ControllerProtocol {
  constructor (
    private readonly activateAccountValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.activateAccountValidator.validate(credentials)
    if (error) return this.httpHelper.unauthorized(error)

    const user = await this.userDbRepository.findUserByEmail(credentials.email) as IUser

    await this.clearTemporary(user)
    await this.activateAccount(user)

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({
      user: filteredUser,
      refreshToken,
      accessToken
    })
  }

  private async clearTemporary (user: IUser): Promise<void> {
    user.temporary.activationCode = null
    user.temporary.activationCodeExpiration = null

    await this.userDbRepository.updateUser(user, {
      'temporary.activationCode': user.temporary.activationCode,
      'temporary.activationCodeExpiration': user.temporary.activationCode
    })
  }

  private async activateAccount (user: IUser): Promise<void> {
    user.settings.accountActivated = true

    await this.userDbRepository.updateUser(user, {
      'settings.accountActivated': user.settings.accountActivated
    })
  }
}
