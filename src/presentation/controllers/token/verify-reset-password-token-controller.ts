import { GenerateTokenProtocol, VerifyTokenProtocol } from '@/application/protocols/providers'
import { MustLogoutError } from '@/application/usecases/errors'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class VerifyResetPasswordTokenController implements ControllerProtocol {
  constructor (
    private readonly generateAccessToken: GenerateTokenProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly verifyResetPasswordToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const token = httpRequest.params.token

    const response = await this.verifyResetPasswordToken.verify(token)

    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const accessToken = await this.generateAccessToken.generate(response)

    return this.httpHelper.ok({ accessToken })
  }
}
