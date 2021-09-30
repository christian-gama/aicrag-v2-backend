import { VerifyTokenProtocol } from '@/domain/providers'

import { MustLogoutError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class VerifyResetPasswordTokenController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly verifyResetPasswordToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user != null) return this.httpHelper.forbidden(new MustLogoutError())

    const token = httpRequest.params.token

    const response = await this.verifyResetPasswordToken.verify(token)

    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    return this.httpHelper.ok({ accessToken: token })
  }
}
