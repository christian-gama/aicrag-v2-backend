import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLogoutError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const credentials = httpRequest.body

    const error = await this.credentialsValidator.validate(credentials)

    if (error?.name === 'InvalidParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'MissingParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'UserCredentialError') return this.httpHelper.unauthorized(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    const accessToken = this.generateAccessToken.generate(user) as string

    if (error?.name === 'InactiveAccountError') {
      return this.httpHelper.ok({
        accessToken,
        message: error.message
      })
    }

    const refreshToken = await this.generateRefreshToken.generate(user)

    const updatedUser = await this.userDbRepository.updateUser(user, {
      'logs.lastLoginAt': new Date(Date.now())
    }) as IUser

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({
      accessToken,
      refreshToken,
      user: filteredUser
    })
  }
}
