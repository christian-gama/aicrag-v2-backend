import { IUser } from '@/domain'
import { FilterUserDataProtocol } from '@/domain/helpers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateEmailByCodeController implements ControllerProtocol {
  constructor (
    private readonly updateEmailByCodeValidator: ValidatorProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.updateEmailByCodeValidator.validate(credentials)
    if (error != null) return this.httpHelper.badRequest(error)

    const user = (await this.userDbRepository.findUserByEmail(credentials.email)) as IUser

    const update = {}
    Object.assign(update, this.updateEmail(user))
    Object.assign(update, this.clearTemporary(user))

    const updatedUser = (await this.userDbRepository.updateUser(user, update)) as IUser

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
