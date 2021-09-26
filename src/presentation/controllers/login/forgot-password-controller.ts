import { IUser } from '@/domain'

import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'
import { FilterUserData } from '@/application/usecases/helpers'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class ForgotPasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserData,
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const credential = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(credential)

    if (error != null) return this.httpHelper.badRequest(error)

    let user = (await this.userDbRepository.findUserByEmail(credential.email)) as IUser

    const resetPasswordToken = await this.generateAccessToken.generate(user)

    user = (await this.userDbRepository.updateUser(user, {
      'temporary.resetPasswordToken': resetPasswordToken
    })) as IUser

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
