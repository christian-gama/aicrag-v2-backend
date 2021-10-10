import { IUser } from '@/domain'
import { HasherProtocol } from '@/domain/cryptography'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLogoutError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class ResetPasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly resetPasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly verifyResetPasswordToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const response = await this.verifyResetPasswordToken.verify(httpRequest.cookies?.accessToken)
    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const data = httpRequest.body

    const error = await this.resetPasswordValidator.validate(data)
    if (error != null) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(data.password)

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': hashedPassword,
      'temporary.resetPasswordToken': null
    }
    const updatedUser = await this.userDbRepository.updateUser<IUser>(response.personal.id, update)

    const refreshToken = await this.generateRefreshToken.generate(updatedUser)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ refreshToken, user: filteredUser })
  }
}
