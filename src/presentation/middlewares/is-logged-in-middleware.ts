import { IUser } from '@/domain'
import { IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '../http/protocols'
import { IMiddleware } from './protocols/middleware-protocol'

export class IsLoggedInMiddleware implements IMiddleware {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = await this.verifyRefreshToken.verify(httpRequest.cookies?.refreshToken)

    if (user instanceof Error) return this.httpHelper.ok({ user: undefined })

    const updatedUser = await this.userRepository.updateUser<IUser>(user.personal.id, {
      'logs.lastSeenAt': new Date(Date.now())
    })

    const result = this.httpHelper.ok({ user: updatedUser })

    return result
  }
}
