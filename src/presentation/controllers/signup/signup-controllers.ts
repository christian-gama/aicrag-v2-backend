import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { AccountValidatorProtocol } from '@/application/protocols/validators/account/account-validator-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class SignUpController implements ControllerProtocol {
  constructor (
    private readonly accountDbRepository: AccountDbRepositoryProtocol,
    private readonly accountValidator: AccountValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    this.accountValidator.validate(account)

    await this.accountDbRepository.saveAccount(account)

    return Promise.resolve({ statusCode: 0, data: {} })
  }
}
