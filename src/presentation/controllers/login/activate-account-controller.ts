import { IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class ActivateAccountController implements IController {
  constructor (
    private readonly activateAccountValidator: IValidator,
    private readonly filterUserData: IFilterUserData,
    private readonly generateAccessToken: IGenerateToken,
    private readonly generateRefreshToken: IGenerateToken,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    const error = await this.activateAccountValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const user = (await this.userRepository.findByEmail(data.email)) as IUser

    const update = {}
    Object.assign(update, this.activateAccount(user))
    Object.assign(update, this.clearTemporary(user))

    const updatedUser = await this.userRepository.updateById<IUser>(user.personal.id, update)

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    const result = this.httpHelper.ok({
      accessToken,
      refreshToken,
      user: filteredUser
    })

    return result
  }

  private activateAccount (user: IUser): Record<string, any> {
    user.settings.accountActivated = true

    const result = {
      'settings.accountActivated': user.settings.accountActivated
    }

    return result
  }

  private clearTemporary (user: IUser): Record<string, any> {
    user.temporary.activationCode = null
    user.temporary.activationCodeExpiration = null

    const result = {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.activationCode': user.temporary.activationCode,
      'temporary.activationCodeExpiration': user.temporary.activationCode
    }

    return result
  }
}
