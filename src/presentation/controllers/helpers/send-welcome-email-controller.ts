import { IUser } from '@/domain'

import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class SendWelcomeEmailController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly sendWelcomeValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.sendWelcomeValidator.validate(credentials)

    if (error) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    return this.httpHelper.ok({
      message: `A welcome email with activation code has been sent to ${user.personal.email}`
    })
  }
}
