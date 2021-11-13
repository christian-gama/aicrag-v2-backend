import { IUser } from '@/domain'
import { IFilterUserData, IPin } from '@/domain/helpers'
import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class UpdateMeController implements IController {
  constructor (
    private readonly emailPin: IPin,
    private readonly filterUserData: IFilterUserData,
    private readonly httpHelper: IHttpHelper,
    private readonly userRepository: IUserRepository,
    private readonly updateMeValidator: IValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = httpRequest.body

    const error = await this.updateMeValidator.validate(data)
    if (error) {
      switch (error.name) {
        case 'ConflictParamError':
          return this.httpHelper.conflict(error)
        default:
          return this.httpHelper.badRequest(error)
      }
    }

    const update = {}

    if (data.currency) {
      update['settings.currency'] = data.currency
    }

    if (data.email) {
      update['temporary.tempEmail'] = data.email
      update['temporary.tempEmailPin'] = this.emailPin.generate()
      update['temporary.tempEmailPinExpiration'] = new Date(Date.now() + 10 * 60 * 1000)
    }

    if (data.name) {
      update['personal.name'] = data.name
    }

    const isEmpty = Object.keys(update).length === 0

    let result: HttpResponse
    if (isEmpty) {
      result = this.httpHelper.ok({ message: 'No changes were made' })

      return result
    } else {
      update['logs.updatedAt'] = new Date(Date.now())

      const updatedUser = await this.userRepository.updateById<IUser>(user.personal.id, update)

      const filteredUser = this.filterUserData.filter(updatedUser)

      result = this.httpHelper.ok({ user: filteredUser })

      return result
    }
  }
}
