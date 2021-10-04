import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

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

    const update = {}
    Object.assign(update, this.activateAccount(user))
    Object.assign(update, this.clearTemporary(user))

    const updatedUser = (await this.userDbRepository.updateUser(user, update)) as IUser

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({
      accessToken,
      refreshToken,
      user: filteredUser
    })
  }

  private activateAccount (user: IUser): Record<string, any> {
    user.settings.accountActivated = true

    const update = {
      'settings.accountActivated': user.settings.accountActivated
    }

    return update
  }

  private clearTemporary (user: IUser): Record<string, any> {
    user.temporary.activationCode = null
    user.temporary.activationCodeExpiration = null

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.activationCode': user.temporary.activationCode,
      'temporary.activationCodeExpiration': user.temporary.activationCode
    }

    return update
  }
}
