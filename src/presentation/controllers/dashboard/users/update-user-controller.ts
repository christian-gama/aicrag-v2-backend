import { IUser, IUserRole } from '@/domain'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError, UserNotFoundError } from '@/application/errors'
import { HttpRequest, HttpResponse, IHttpHelper } from '@/presentation/http/protocols'
import { IController } from '../../protocols/controller.model'

export class UpdateUserController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly updateUserValidator: IValidator,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const userToUpdate = await this.userRepository.findById(httpRequest.body.id)
    if (!userToUpdate) return this.httpHelper.notFound(new UserNotFoundError())

    const data = { user: userToUpdate, ...httpRequest.body }

    const error = await this.updateUserValidator.validate(data)
    if (error) {
      switch (error.name) {
        case 'PermissionError':
          return this.httpHelper.forbidden(error)
        default:
          return this.httpHelper.badRequest(error)
      }
    }

    const update = {}

    if (data.accountStatus) {
      update['settings.activateAccount'] = data.accountStatus === 'active'
    }

    if (data.email) {
      update['personal.email'] = data.email
    }

    if (data.handicap) {
      update['settings.handicap'] = data.handicap
    }

    if (data.name) {
      update['personal.name'] = data.name
    }

    if (data.role) {
      update['settings.role'] = IUserRole[data.role]
    }

    if (data.tokenVersion) {
      // eslint-disable-next-line @typescript-eslint/dot-notation
      update['tokenVersion'] = data.tokenVersion
    }

    const isEmpty = Object.keys(update).length === 0

    let result: HttpResponse
    if (isEmpty) {
      result = this.httpHelper.ok({ message: 'No changes were made' })

      return result
    } else {
      update['logs.updatedAt'] = new Date(Date.now())

      const updatedUser = await this.userRepository.updateById<IUser>(userToUpdate.personal.id, update)

      result = this.httpHelper.ok({ user: updatedUser })

      return result
    }
  }
}
