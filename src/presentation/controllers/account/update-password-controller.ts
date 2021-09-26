import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (private readonly httpHelper: HttpHelperProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.httpHelper.ok({ user: 'filteredUser' })
  }
}
