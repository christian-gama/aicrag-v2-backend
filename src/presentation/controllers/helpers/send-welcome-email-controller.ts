import { ValidatorProtocol } from '@/application/protocols/validators'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendWelcomeValidator: ValidatorProtocol

  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    await this.sendWelcomeValidator.validate(credentials)

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${credentials.email as string}`
    })
  }
}
