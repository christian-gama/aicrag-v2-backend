import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { GenerateTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import {
  MustLogoutError,
  ConflictParamError
} from '@/application/usecases/errors'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

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
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const signUpUserCredentials = httpRequest.body

    const error = await this.userValidator.validate(signUpUserCredentials)

    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const emailExists = await this.userDbRepository.findUserByEmail(signUpUserCredentials.email)

    if (emailExists) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    const user = await this.userDbRepository.saveUser(signUpUserCredentials)

    const accessToken = this.generateAccessToken.generate(user) as string

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser, accessToken })
  }
}
