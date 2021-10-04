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

    const updatedUser = await this.updateEmail(user)
    await this.clearTemporary(user)

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({
      user: filteredUser
    })
  }

  private async updateEmail (user: IUser): Promise<IUser> {
    user.personal.email = user.temporary.tempEmail as string

    const update = {
      'logs.updatedAt': new Date(Date.now()),
      'personal.email': user.personal.email
    }
    const updatedUser = await this.userDbRepository.updateUser(user, update)

    return updatedUser as IUser
  }

  private async clearTemporary (user: IUser): Promise<void> {
    user.temporary.tempEmail = null
    user.temporary.tempEmailCode = null
    user.temporary.tempEmailCodeExpiration = null

    await this.userDbRepository.updateUser(user, {
      'temporary.tempEmail': user.temporary.tempEmail,
      'temporary.tempEmailCode': user.temporary.tempEmailCode,
      'temporary.tempEmailCodeExpiration': user.temporary.tempEmailCodeExpiration
    })
  }
}
