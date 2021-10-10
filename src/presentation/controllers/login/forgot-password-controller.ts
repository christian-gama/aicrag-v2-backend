import { IUser } from '@/domain'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLogoutError } from '@/application/errors'
import { FilterUserData } from '@/application/helpers'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class ForgotPasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserData,
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const data = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(data)

    if (error != null) return this.httpHelper.badRequest(error)

    let user = (await this.userRepository.findUserByEmail(data.email)) as IUser

    const resetPasswordToken = await this.generateAccessToken.generate(user)

    user = await this.userRepository.updateUser<IUser>(user.personal.id, {
      'temporary.resetPasswordToken': resetPasswordToken
    })

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
