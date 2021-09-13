import { User } from '@/domain/user'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { FilterUserDataProtocol } from '@/application/usecases/helpers/filter-user-data'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helper/http/protocols'

export class ActivateAccountController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly activateAccountValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    const error = await this.activateAccountValidator.validate(account)

    if (error) return this.httpHelper.unauthorized(error)

    const user = (await this.accountDbRepository.findAccountByEmail(account.email)) as User

    this.filterUserData.filter(user)

    return Promise.resolve({ status: 'success', statusCode: 200, data: {} })
  }
}
