import { IUser } from '@/domain'
import { VerifyTokenProtocol } from '@/domain/providers'
import { UserRepositoryProtocol } from '@/domain/repositories'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '../http/protocols'
import { MiddlewareProtocol } from './protocols/middleware-protocol'

export class IsLoggedInMiddleware implements MiddlewareProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly verifyRefreshToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = await this.verifyRefreshToken.verify(httpRequest.cookies?.refreshToken)

    if (user instanceof Error) return this.httpHelper.ok({ user: undefined })

    const updatedUser = await this.userRepository.updateUser<IUser>(user.personal.id, {
      'logs.lastSeenAt': new Date(Date.now())
    })

    return this.httpHelper.ok({ user: updatedUser })
  }
}
