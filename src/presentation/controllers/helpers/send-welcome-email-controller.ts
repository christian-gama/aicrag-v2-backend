import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const email = httpRequest.body.email as string

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${email}`
    })
  }
}
