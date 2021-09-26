import { IUser } from '@/domain'

import { HasherProtocol } from '@/application/protocols/cryptography'
import { FilterUserDataProtocol } from '@/application/protocols/helpers'
import { UserDbRepositoryProtocol } from '@/application/protocols/repositories'
import { ValidatorProtocol } from '@/application/protocols/validators'

import {
  HttpHelperProtocol,
  HttpRequest,
  HttpResponse
} from '@/presentation/helpers/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdatePasswordController implements ControllerProtocol {
  constructor (
    private readonly filterUserData: FilterUserDataProtocol,
    private readonly hasher: HasherProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly updatePasswordValidator: ValidatorProtocol,
    private readonly userDbRepository: UserDbRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const credentials = httpRequest.body

    const error = await this.updatePasswordValidator.validate(credentials)
    if (error) return this.httpHelper.badRequest(error)

    const hashedPassword = await this.hasher.hash(credentials.password)

    const user = await this.userDbRepository.findUserByEmail(credentials.email) as IUser

    const updatedUser = await this.userDbRepository.updateUser(user, { 'personal.password': hashedPassword }) as IUser

    const filteredUser = this.filterUserData.filter(updatedUser)

    return this.httpHelper.ok({ user: filteredUser })
  }
}
