import { IUser } from '@/domain'
import { IHasher } from '@/domain/cryptography'
import { IFilterUserData } from '@/domain/helpers'
import { IGenerateToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class UpdatePasswordController implements IController {
  constructor (
    private readonly filterUserData: IFilterUserData,
    private readonly generateAccessToken: IGenerateToken,
    private readonly generateRefreshToken: IGenerateToken,
    private readonly hasher: IHasher,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: IValidator,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = Object.assign({ user }, httpRequest.body)

    const error = await this.updatePasswordValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(data.password)

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.password': hashedPassword
    }
    const updatedUser = await this.userRepository.updateById<IUser>(user.personal.id, update)

    const accessToken = this.generateAccessToken.generate(user) as string

    const refreshToken = await this.generateRefreshToken.generate(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    const result = this.httpHelper.ok({ accessToken, refreshToken, user: filteredUser })

    return result
  }
}
