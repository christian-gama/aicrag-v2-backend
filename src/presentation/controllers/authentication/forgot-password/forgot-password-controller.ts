import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../login'

export class ForgotPasswordController implements ControllerProtocol {
  constructor (
    private readonly forgotPasswordValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    await this.forgotPasswordValidator.validate(email)

    return this.httpHelper.ok({})
  }
}
