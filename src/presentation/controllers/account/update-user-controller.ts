import { IUser } from '@/domain'
import { IFilterUserData, IValidationCode } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class UpdateUserController implements IController {
  constructor (
    private readonly emailCode: IValidationCode,
    private readonly filterUserData: IFilterUserData,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userRepository: IUserRepository,
    private readonly validateCurrency: IValidator,
    private readonly validateEmail: IValidator,
    private readonly validateName: IValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = httpRequest.body

    const update = {}

    if (data.currency) {
      const error = await this.validateCurrency.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update['settings.currency'] = data.currency
    }

    if (data.email) {
      const error = await this.validateEmail.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      const userExists = await this.userRepository.findUserByEmail(data.email)

      if (userExists) return this.httpHelper.conflict(new ConflictParamError('email'))

      update['temporary.tempEmail'] = data.email
      update['temporary.tempEmailCode'] = this.emailCode.generate()
      update['temporary.tempEmailCodeExpiration'] = new Date(Date.now() + 10 * 60 * 1000)
    }

    if (data.name) {
      const error = await this.validateName.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update['personal.name'] = data.name
    }

    const isEmpty = Object.keys(update).length === 0

    let result: HttpResponse
    if (isEmpty) {
      result = this.httpHelper.ok({ message: 'No changes were made' })

      return result
    } else {
      update['logs.updatedAt'] = new Date(Date.now())

      const updatedUser = await this.userRepository.updateUser<IUser>(user.personal.id, update)

      const filteredUser = this.filterUserData.filter(updatedUser)

      result = this.httpHelper.ok({ user: filteredUser })

      return result
    }
  }
}
