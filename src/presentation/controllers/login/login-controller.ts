import { EncrypterProtocol } from '@/application/protocols/cryptography/encrypter-protocol'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { User } from '@/domain/user'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class LoginController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly credentialsValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly jwtAdapter: EncrypterProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.credentialsValidator.validate(credentials)

    if (error) return this.httpHelper.notFound(error)

    const user = (await this.accountDbRepository.findAccountByEmail(credentials.email)) as User

    const accessToken = this.jwtAdapter.encryptId(user.personal.id)

    return this.httpHelper.ok({ user, accessToken })
  }
}
