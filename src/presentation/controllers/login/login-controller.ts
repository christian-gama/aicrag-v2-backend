import { IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLogoutError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class LoginController implements IController {
  constructor (
    private readonly loginValidator: IValidator,
    private readonly filterUserData: IFilterUserData,
    private readonly generateAccessToken: IGenerateToken,
    private readonly generateRefreshToken: IGenerateToken,
    private readonly httpHelper: IHttpHelper,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const data = httpRequest.body

    const error = await this.loginValidator.validate(data)

    if (error?.name === 'InvalidParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'InvalidTypeError') return this.httpHelper.badRequest(error)
    if (error?.name === 'MissingParamError') return this.httpHelper.badRequest(error)
    if (error?.name === 'UserCredentialError') return this.httpHelper.unauthorized(error)

    const user = (await this.userRepository.findByEmail(data.email)) as IUser

    const accessToken = this.generateAccessToken.generate(user) as string

    if (error?.name === 'InactiveAccountError') {
      return this.httpHelper.ok({
        accessToken,
        message: error.message
      })
    }

    const refreshToken = await this.generateRefreshToken.generate(user)

    const updatedUser = await this.userRepository.updateById<IUser>(user.personal.id, {
      'logs.lastLoginAt': new Date(Date.now())
    })

    const filteredUser = this.filterUserData.filter(updatedUser)

    const result = this.httpHelper.ok({
      accessToken,
      refreshToken,
      user: filteredUser
    })

    return result
  }
}
