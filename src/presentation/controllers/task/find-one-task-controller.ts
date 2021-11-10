import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError, TaskNotFoundError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class FindOneTaskController implements IController {
  constructor (
    private readonly validateTaskParam: IValidator,
    private readonly httpHelper: IHttpHelper,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = httpRequest.params

    const error = await this.validateTaskParam.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const task = await this.taskRepository.findById(data.id, user.personal.id)
    if (!task) return this.httpHelper.badRequest(new TaskNotFoundError())

    const result = this.httpHelper.ok({ task })

    return result
  }
}
