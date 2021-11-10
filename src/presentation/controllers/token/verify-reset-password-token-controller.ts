import { IVerifyToken } from '@/domain/providers'
import { MustLogoutError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class VerifyResetPasswordTokenController implements IController {
  constructor (private readonly httpHelper: IHttpHelper, private readonly verifyResetPasswordToken: IVerifyToken) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const token = httpRequest.params.token

    const response = await this.verifyResetPasswordToken.verify(token)

    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const result = this.httpHelper.ok({ accessToken: token })

    return result
  }
}
