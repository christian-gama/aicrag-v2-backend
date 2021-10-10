import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { UserRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateEmailByCodeController implements ControllerProtocol {
  constructor (
    private readonly updateEmailByCodeValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    const data = Object.assign({ user }, httpRequest.body)

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.updateEmailByCodeValidator.validate(data)
    if (error != null) return this.httpHelper.badRequest(error)

    const update = {}
    Object.assign(update, this.updateEmail(user))
    Object.assign(update, this.clearTemporary(user))

    const updatedUser = await this.userRepository.updateUser<IUser>(user.personal.id, update)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({
      user: filteredUser
    })
  }

  private updateEmail (user: IUser): Record<string, any> {
    user.personal.email = user.temporary.tempEmail as string

    const update = {
      'personal.email': user.personal.email
    }

    return update
  }

  private clearTemporary (user: IUser): Record<string, any> {
    user.temporary.tempEmail = null
    user.temporary.tempEmailCode = null
    user.temporary.tempEmailCodeExpiration = null

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.tempEmail': user.temporary.tempEmail,
      'temporary.tempEmailCode': user.temporary.tempEmailCode,
      'temporary.tempEmailCodeExpiration': user.temporary.tempEmailCodeExpiration
    }

    return update
  }
}
