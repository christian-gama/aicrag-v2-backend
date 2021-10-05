import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class CreateTaskController implements ControllerProtocol {
  constructor (
    private readonly createTaskValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body
    const user = httpRequest.user

    const error = await this.createTaskValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    return this.httpHelper.ok({})
  }
}
