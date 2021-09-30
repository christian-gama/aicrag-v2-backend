import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class ActivateAccountController implements ControllerProtocol {
  constructor (
    private readonly activateAccountValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.activateAccountValidator.validate(credentials)
    if (error != null) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    await this.activateAccount(user)
    await this.clearTemporary(user)

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({
      accessToken,
      refreshToken,
      user: filteredUser
    })
  }

  private async activateAccount (user: IUser): Promise<void> {
    user.settings.accountActivated = true

    await this.userDbRepository.updateUser(user, {
      'settings.accountActivated': user.settings.accountActivated
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
}
