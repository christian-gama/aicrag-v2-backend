import { IUserRepository } from '@/domain/repositories'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class LogoutController implements IController {
  constructor (private readonly httpHelper: HttpHelperProtocol, private readonly userRepository: IUserRepository) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { user } = httpRequest
    if (!user) return this.httpHelper.forbidden(new MustLoginError())

    user.tokenVersion++
    await this.userRepository.updateUser(user.personal.id, { tokenVersion: user.tokenVersion })

    return this.httpHelper.ok({ message: "You've been logged out" })
  }
}
