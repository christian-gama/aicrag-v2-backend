import { IUser } from '@/domain'
import { HasherProtocol } from '@/domain/cryptography'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    const data = Object.assign({ user }, httpRequest.body)

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.updatePasswordValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(data.password)

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': hashedPassword
    }
    const updatedUser = await this.userDbRepository.updateUser<IUser>(user.personal.id, update)

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ accessToken, refreshToken, user: filteredUser })
  }
}
