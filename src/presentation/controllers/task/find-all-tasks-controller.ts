import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller-protocol'

export class FindAllTasksController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly queryValidator: IValidator,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const query = httpRequest.query

    const error = await this.queryValidator.validate(query)
    if (error) return this.httpHelper.badRequest(error)

    const allTasks = await this.taskRepository.findAll(user.personal.id, query)

    const result = this.httpHelper.ok({
      count: allTasks.count,
      displaying: allTasks.displaying,
      documents: allTasks.documents,
      page: allTasks.page
    })

    return result
  }
}
