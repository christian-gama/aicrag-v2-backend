import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateTaskController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly validateTaskParam: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const params = httpRequest.params
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.validateTaskParam.validate(params)
    if (error) return this.httpHelper.badRequest(error)

    return this.httpHelper.ok({ task: '' })
  }
}
