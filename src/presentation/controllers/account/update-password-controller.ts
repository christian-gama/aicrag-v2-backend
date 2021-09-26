import { HasherProtocol } from '@/application/protocols/cryptography'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.updatePasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    await this.hasher.hash(credentials.password)

    await this.userDbRepository.findUserByEmail(credentials.email)

    return this.httpHelper.ok({ user: 'filteredUser' })
  }
}
