import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MustLogoutError, ConflictParamError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class SignUpController implements IController {
  constructor (
    private readonly filterUserData: IFilterUserData,
    private readonly generateAccessToken: IGenerateToken,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository,
    private readonly userValidator: IValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const signUpUserCredentials = httpRequest.body

    const error = await this.userValidator.validate(signUpUserCredentials)
    if (error) return this.httpHelper.badRequest(error)

    const emailExists = await this.userRepository.findUserByEmail(signUpUserCredentials.email)
    if (emailExists) return this.httpHelper.conflict(new ConflictParamError('email'))

    const user = await this.userRepository.saveUser(signUpUserCredentials)

    const accessToken = this.generateAccessToken.generate(user) as string

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ accessToken, user: filteredUser })
  }
}
