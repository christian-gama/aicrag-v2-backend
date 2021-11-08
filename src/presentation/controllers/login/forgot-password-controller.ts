import { IUser } from '@/domain'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLogoutError } from '@/application/errors'
import { FilterUserData } from '@/application/helpers'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller-protocol'

export class ForgotPasswordController implements IController {
  constructor (
    private readonly filterUserData: FilterUserData,
    private readonly forgotPasswordValidator: IValidator,
    private readonly generateAccessToken: IGenerateToken,
    private readonly httpHelper: IHttpHelper,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const data = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findByEmail(data.email)) as IUser

    const resetPasswordToken = await this.generateAccessToken.generate(user)

    user = await this.userRepository.updateById<IUser>(user.personal.id, {
      'temporary.resetPasswordToken': resetPasswordToken
    })

    const filteredUser = this.filterUserData.filter(user)

    const result = this.httpHelper.ok({ user: filteredUser })

    return result
  }
}
