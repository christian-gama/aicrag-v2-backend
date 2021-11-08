import { IUser } from '@/domain'
import { MustLoginError, PermissionError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '../http/protocols'
import { IMiddleware } from './protocols/middleware-protocol'

export class PermissionMiddleware implements IMiddleware {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly permission: 'administrator' | 'moderator' | 'user' | 'guest'
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = (httpRequest.user as IUser) || undefined
    if (!user) {
      return this.httpHelper.unauthorized(new MustLoginError())
    }

    if (user.settings.role !== this.permission) {
      return this.httpHelper.forbidden(new PermissionError())
    }

    const result = this.httpHelper.ok({})

    return result
  }
}
