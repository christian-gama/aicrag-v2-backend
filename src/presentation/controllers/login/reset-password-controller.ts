import { HasherProtocol } from '@/application/protocols/cryptography'
import { VerifyTokenProtocol } from '@/application/protocols/providers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'
import { MustLogoutError } from '@/application/usecases/errors'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class ResetPasswordController implements ControllerProtocol {
  constructor (
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly resetPasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly verifyResetPasswordToken: VerifyTokenProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (httpRequest.user) return this.httpHelper.forbidden(new MustLogoutError())

    const response = await this.verifyResetPasswordToken.verify(httpRequest.accessToken)
    if (response instanceof Error) {
      return this.httpHelper.unauthorized(response)
    }

    const credentials = httpRequest.body

    const error = await this.resetPasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(credentials.password)

    await this.userDbRepository.updateUser(response, {
      'personal.password': hashedPassword
    })

    return this.httpHelper.ok({})
  }
}
