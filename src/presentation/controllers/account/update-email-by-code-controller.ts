import { IUser } from '@/domain'
import { IFilterUserData } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class UpdateEmailByCodeController implements IController {
  constructor (
    private readonly updateEmailByCodeValidator: IValidator,
    private readonly filterUserData: IFilterUserData,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = Object.assign({ user }, httpRequest.body)

    const error = await this.updateEmailByCodeValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const update = {}
    Object.assign(update, this.updateEmail(user))
    Object.assign(update, this.clearTemporary(user))

    const updatedUser = await this.userRepository.updateUser<IUser>(user.personal.id, update)

    const filteredUser = this.filterUserData.filter(updatedUser)

    const result = this.httpHelper.ok({
      user: filteredUser
    })

    return result
  }

  private updateEmail (user: IUser): Record<string, any> {
    user.personal.email = user.temporary.tempEmail as string

    const result = {
      'personal.email': user.personal.email
    }

    return result
  }

  private clearTemporary (user: IUser): Record<string, any> {
    user.temporary.tempEmail = null
    user.temporary.tempEmailCode = null
    user.temporary.tempEmailCodeExpiration = null

    const result = {
      'logs.updatedAt': new Date(Date.now()),
      'temporary.tempEmail': user.temporary.tempEmail,
      'temporary.tempEmailCode': user.temporary.tempEmailCode,
      'temporary.tempEmailCodeExpiration': user.temporary.tempEmailCodeExpiration
    }

    return result
  }
}
