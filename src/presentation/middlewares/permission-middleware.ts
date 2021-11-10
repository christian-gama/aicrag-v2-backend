import { IUser, IUserRole } from '@/domain'
import { PermissionError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '../http/protocols'
import { IMiddleware } from './protocols/middleware.model'

export class PermissionMiddleware implements IMiddleware {
  constructor (private readonly httpHelper: IHttpHelper, private readonly permission: IUserRole) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // To run this middleware, the user must be logged in (run protected/partial middleware first)
    const user = httpRequest.user as IUser

    if (this.permission === IUserRole.administrator && +user.settings.role < +IUserRole.administrator) {
      return this.httpHelper.forbidden(new PermissionError())
    } else if (this.permission === IUserRole.moderator && +user.settings.role < +IUserRole.moderator) {
      return this.httpHelper.forbidden(new PermissionError())
    } else if (this.permission === IUserRole.user && +user.settings.role < +IUserRole.user) {
      return this.httpHelper.forbidden(new PermissionError())
    }

    const result = this.httpHelper.ok({})

    return result
  }
}
