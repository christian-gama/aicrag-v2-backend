import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories/user/user-db-repository-protocol'
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
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAccessToken: EncrypterProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body

    const error = await this.forgotPasswordValidator.validate(email)

    if (error) return this.httpHelper.badRequest(error)

    await this.userDbRepository.findUserByEmail(email)

    this.jwtAccessToken.encrypt({ email })

    return this.httpHelper.ok({})
  }
}
