import { IUser } from '@/domain'
import { FilterUserDataProtocol, ValidationCodeProtocol } from '@/domain/helpers'
import { UserDbRepositoryProtocol } from '@/domain/repositories'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError, MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePersonalController implements ControllerProtocol {
  constructor (
    private readonly emailCode: ValidationCodeProtocol,
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol,
    private readonly validateEmail: ValidatorProtocol,
    private readonly validateName: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    const credentials = httpRequest.body

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    let updatedUser: IUser | undefined
    if (credentials.name) {
      const error = await this.validateName.validate(credentials)
      if (error) return this.httpHelper.badRequest(error)

      updatedUser = await this.userDbRepository.updateUser(user, {
        'personal.name': credentials.name
      })
    }

    if (credentials.email) {
      const error = await this.validateEmail.validate(credentials)
      if (error) return this.httpHelper.badRequest(error)

      const userExists = await this.userDbRepository.findUserByEmail(credentials.email)

      if (userExists) return this.httpHelper.conflict(new ConflictParamError('email'))

      updatedUser = await this.userDbRepository.updateUser(user, {
        'temporary.tempEmail': credentials.email
      })
      updatedUser = await this.userDbRepository.updateUser(user, {
        'temporary.tempEmailCode': this.emailCode.generate()
      })
    }

    if (!updatedUser) return this.httpHelper.ok({ message: 'No changes were made' })

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
