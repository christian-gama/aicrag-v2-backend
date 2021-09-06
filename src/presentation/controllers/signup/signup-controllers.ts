import { AccountDbRepositoryProtocol } from '@/application/protocols/repositories/account/account-db-repository-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { ControllerProtocol } from '../protocols/controller-protocol'

export class SignUpController implements ControllerProtocol {
  constructor (private readonly accountDbRepository: AccountDbRepositoryProtocol) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const account = httpRequest.body

    await this.accountDbRepository.saveAccount(account)

    return Promise.resolve({ statusCode: 0, data: {} })
  }
}
