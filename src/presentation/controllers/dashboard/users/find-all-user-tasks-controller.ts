import { IUserRepository } from '@/domain/repositories'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError, UserNotFoundError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../../protocols/controller.model'

export class FindAllUserTasksController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly queryValidator: IValidator,
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const query = httpRequest.query
    const params = httpRequest.params

    const data = { ...query, ...params }

    const error = await this.queryValidator.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const taskOwner = await this.userRepository.findById(params.userId)
    if (!taskOwner) return this.httpHelper.badRequest(new UserNotFoundError())

    const allTasks = await this.taskRepository.findAll(taskOwner.personal.id, query)

    const result = this.httpHelper.ok({
      count: allTasks.count,
      displaying: allTasks.displaying,
      documents: allTasks.documents,
      page: allTasks.page
    })

    return result
  }
}
