import { UserRepositoryProtocol } from '@/domain/repositories'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class LogoutController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { user } = httpRequest

    if (user == null) return this.httpHelper.forbidden(new MustLoginError())

    user.tokenVersion++
    await this.userRepository.updateUser(user.personal.id, { tokenVersion: user.tokenVersion })

    return this.httpHelper.ok({ message: "You've been logged out" })
  }
}
