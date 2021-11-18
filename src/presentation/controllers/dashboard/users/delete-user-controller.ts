import { ITaskRepository, IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError, UserNotFoundError } from '@/application/errors'
import { HttpRequest, HttpResponse, IHttpHelper } from '@/presentation/http/protocols'
import { IController } from '../../protocols/controller.model'

export class DeleteUserController implements IController {
  constructor (
    private readonly deleteUserValidator: IValidator,
    private readonly httpHelper: IHttpHelper,
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = httpRequest.params

    const error = await this.deleteUserValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const deleted = await this.userRepository.deleteById(data.id)
    if (!deleted) return this.httpHelper.badRequest(new UserNotFoundError())

    await this.taskRepository.deleteManyByUserId(data.id)

    const result = this.httpHelper.deleted()

    return result
  }
}
