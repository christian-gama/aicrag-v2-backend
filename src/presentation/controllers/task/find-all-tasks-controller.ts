import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class FindAllTasksController implements IController {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly queryValidator: IValidator,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const query = httpRequest.query
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.queryValidator.validate(query)
    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const result = await this.taskRepository.findAllTasks(user.personal.id, query)

    return this.httpHelper.ok({
      count: result.count,
      displaying: result.displaying,
      documents: result.documents,
      page: result.page
    })
  }
}
