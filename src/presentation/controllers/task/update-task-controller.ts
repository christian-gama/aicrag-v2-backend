import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateTaskController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    return this.httpHelper.ok({ task: '' })
  }
}
