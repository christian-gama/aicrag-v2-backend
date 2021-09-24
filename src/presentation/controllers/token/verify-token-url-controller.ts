import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class VerifyTokenUrlController implements ControllerProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly verifyAccessToken: VerifyTokenProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const token = httpRequest.param.token

    const response = await this.verifyAccessToken.verify(token)

    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    return this.httpHelper.ok({})
  }
}
