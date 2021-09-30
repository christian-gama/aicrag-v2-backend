import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLogoutError, ConflictParamError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly userValidator: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const signUpUserCredentials = httpRequest.body

    const error = await this.userValidator.validate(signUpUserCredentials)

    if (error != null) {
      return this.httpHelper.badRequest(error)
    }

    const emailExists = await this.userDbRepository.findUserByEmail(signUpUserCredentials.email)

    if (emailExists != null) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    const user = await this.userDbRepository.saveUser(signUpUserCredentials)

    const accessToken = this.generateAccessToken.generate(user) as string

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ accessToken, user: filteredUser })
  }
}
