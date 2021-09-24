import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { MustLogoutError } from '@/application/usecases/errors'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class ResetPasswordController implements ControllerProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly verifyAccessToken: VerifyTokenProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    await this.verifyAccessToken.verify(httpRequest.accessToken)

    return this.httpHelper.ok({})
  }
}
