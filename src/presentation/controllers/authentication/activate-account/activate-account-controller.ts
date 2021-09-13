import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'

export class ActivateAccountController implements ControllerProtocol {
  constructor (private readonly activateAccountValidator: ValidatorProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    await this.activateAccountValidator.validate(account)

    return Promise.resolve({ status: 'success', statusCode: 200, data: {} })
  }
}
