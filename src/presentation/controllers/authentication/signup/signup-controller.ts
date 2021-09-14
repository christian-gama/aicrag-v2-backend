import { ControllerProtocol } from '.'
import { FilterUserDataProtocol } from '@/application/protocols/helpers/filter-user-data/filter-user-data-protocol'
import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { ValidatorProtocol } from '@/application/protocols/validators/validator-protocol'
import { ConflictParamError } from '@/application/usecases/errors/'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly accountValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    const error = await this.accountValidator.validate(account)

    const emailExists = await this.accountDbRepository.findAccountByEmail(account.email)

    if (emailExists) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const user = await this.accountDbRepository.saveAccount(account)

    const filteredUser = this.filterUserData.filter(user)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
