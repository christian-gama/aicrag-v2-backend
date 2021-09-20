import { MustLoginError } from '@/application/usecases/errors'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../../protocols/controller-protocol'

export class LogoutController implements ControllerProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.user) return this.httpHelper.forbidden(new MustLoginError())

    return this.httpHelper.ok({})
  }
}
