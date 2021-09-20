import { MustLoginError } from '@/application/usecases/errors'
import { UserDbRepositoryProtocol } from '@/infra/database/mongodb/user'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'
import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'
import { ControllerProtocol } from '../../protocols/controller-protocol'

export class LogoutController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { user } = httpRequest

    if (!user) return this.httpHelper.forbidden(new MustLoginError())

    user.tokenVersion++
    const updateFilter: UserDbFilter = { tokenVersion: user.tokenVersion }
    await this.userDbRepository.updateUser(user, updateFilter)

    return this.httpHelper.ok({})
  }
}
