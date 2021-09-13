import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'

export class ActivateAccountController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly activateAccountValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    const error = await this.activateAccountValidator.validate(account)

    if (error) return this.httpHelper.unauthorized(error)

    await this.accountDbRepository.findAccountByEmail(account.email)

    return Promise.resolve({ status: 'success', statusCode: 200, data: {} })
  }
}
