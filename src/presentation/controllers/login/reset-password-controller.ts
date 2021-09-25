import { IUser } from '@/domain'

import { HasherProtocol } from '@/application/protocols/cryptography'
import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

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
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const response = await this.verifyResetPasswordToken.verify(httpRequest.cookies?.accessToken)
    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const credentials = httpRequest.body

    const error = await this.resetPasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(credentials.password)

    const user = (await this.userDbRepository.updateUser(response, {
      'personal.password': hashedPassword,
      'temporary.resetPasswordToken': null
    })) as IUser

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, refreshToken })
  }
}
