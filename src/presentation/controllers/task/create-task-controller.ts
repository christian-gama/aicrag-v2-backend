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
    const user = httpRequest.user
    const data = Object.assign({ user }, httpRequest.body)

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.createTaskValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    return this.httpHelper.ok({})
  }
}
