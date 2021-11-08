import { IUser } from '@/domain'
import { IVerifyToken } from '@/domain/providers'
import { IUserRepository } from '@/domain/repositories'
import { getToken } from '@/infra/token'
import { IHttpHelper, HttpRequest, HttpResponse } from '../http/protocols'
import { IMiddleware } from './protocols/middleware-protocol'

export class IsLoggedInMiddleware implements IMiddleware {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly userRepository: IUserRepository,
    private readonly verifyRefreshToken: IVerifyToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const refreshToken = getToken.refreshToken(httpRequest)

    const user = await this.verifyRefreshToken.verify(refreshToken)
    if (user instanceof Error) return this.httpHelper.ok({ user: undefined })

    const updatedUser = await this.userRepository.updateById<IUser>(user.personal.id, {
      'logs.lastSeenAt': new Date(Date.now())
    })

    const result = this.httpHelper.ok({ user: updatedUser })

    return result
  }
}
