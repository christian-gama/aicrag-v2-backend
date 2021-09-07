import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { ConflictParamError } from '@/application/usecases/errors/'
import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly accountValidator: AccountValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    const emailExists = await this.accountDbRepository.findAccountByEmail(account.email)

    if (emailExists) {
      return this.httpHelper.conflict(new ConflictParamError('email'))
    }

    const error = this.accountValidator.validate(account)

    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const user = await this.accountDbRepository.saveAccount(account)

    return this.httpHelper.ok({ user })
  }
}
