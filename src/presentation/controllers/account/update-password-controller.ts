import { IUser } from '@/domain'
import { HasherProtocol } from '@/domain/cryptography'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { GenerateTokenProtocol } from '@/domain/providers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly generateRefreshToken: GenerateTokenProtocol,
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body
    const user = httpRequest.user as IUser
    credentials.user = user

    const error = await this.updatePasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(credentials.password)

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': hashedPassword
    }
    const updatedUser = (await this.userDbRepository.updateUser(user, update)) as IUser

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ refreshToken, user: filteredUser })
  }
}
