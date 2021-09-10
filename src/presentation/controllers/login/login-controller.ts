import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { makeFakeUser } from '@/tests/domain/mocks/user-mock'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    await this.credentialsValidator.validate(credentials)

    const user = makeFakeUser()

    const accessToken = 'any_token'

    return this.httpHelper.ok({ user, accessToken })
  }
}
