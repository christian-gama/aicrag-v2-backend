import { IUser } from '@/domain'
import { FilterUserDataProtocol, ValidationCodeProtocol } from '@/domain/helpers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateUserController implements ControllerProtocol {
  constructor (
    private readonly emailCode: ValidationCodeProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly validateCurrency: ValidatorProtocol,
    private readonly validateEmail: ValidatorProtocol,
    private readonly validateName: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    const data = httpRequest.body

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    let updatedUser: IUser | undefined
    if (data.currency) {
      const error = await this.validateCurrency.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      updatedUser = await this.userDbRepository.updateUser(user, {
        'settings.currency': data.currency
      })
    }

    if (data.email) {
      const error = await this.validateEmail.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      const userExists = await this.userDbRepository.findUserByEmail(data.email)

      if (userExists) return this.httpHelper.conflict(new ConflictParamError('email'))

      updatedUser = await this.userDbRepository.updateUser(user, {
        'temporary.tempEmail': data.email
      })
      updatedUser = await this.userDbRepository.updateUser(user, {
        'temporary.tempEmailCode': this.emailCode.generate()
      })
      updatedUser = await this.userDbRepository.updateUser(user, {
        'temporary.tempEmailCodeExpiration': new Date(Date.now() + 10 * 60 * 1000)
      })
    }

    if (data.name) {
      const error = await this.validateName.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      updatedUser = await this.userDbRepository.updateUser(user, {
        'personal.name': data.name
      })
    }

    if (!updatedUser) return this.httpHelper.ok({ message: 'No changes were made' })

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
