import { HasherProtocol } from '@/application/protocols/cryptography'
import { ValidatorProtocol } from '@/application/protocols/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: ValidatorProtocol,
    private readonly hasher: HasherProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.updatePasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    await this.hasher.hash(credentials.password)

    return this.httpHelper.ok({ user: 'filteredUser' })
  }
}
