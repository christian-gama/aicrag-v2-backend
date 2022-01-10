import { IFilterUserData } from '@/domain/helpers'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class GetMeController implements IController {
  constructor (private readonly httpHelper: IHttpHelper, private readonly filterUserData: IFilterUserData) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { user, headers, cookies } = httpRequest
    if (!user) return this.httpHelper.forbidden(new MustLoginError())

    const filteredUser = this.filterUserData.filter(user)
    const accessToken = headers?.['x-access-token'] ?? cookies?.accessToken ?? undefined
    const refreshToken = headers?.['x-refresh-token'] ?? cookies?.refreshToken ?? undefined

    const result = this.httpHelper.ok({ accessToken, refreshToken, user: filteredUser })

    return result
  }
}
