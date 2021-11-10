import { IUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken, IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLogoutError } from '@/application/errors'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class ResetPasswordController implements IController {
  constructor (
    private readonly filterUserData: IFilterUserData,
    private readonly generateRefreshToken: IGenerateToken,
    private readonly hasher: IHasher,
    private readonly httpHelper: IHttpHelper,
    private readonly resetPasswordValidator: IValidator,
    private readonly userRepository: IUserRepository,
    private readonly verifyResetPasswordToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const token = getToken.accessToken(httpRequest)

    const response = await this.verifyResetPasswordToken.verify(token)
    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const data = httpRequest.body

    const error = await this.resetPasswordValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(data.password)

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': hashedPassword,
      'temporary.resetPasswordToken': null
    }
    const updatedUser = await this.userRepository.updateById<IUser>(response.personal.id, update)

    const refreshToken = await this.generateRefreshToken.generate(updatedUser)

    const filteredUser = this.filterUserData.filter(updatedUser)

    const result = this.httpHelper.ok({ refreshToken, user: filteredUser })

    return result
  }
}
