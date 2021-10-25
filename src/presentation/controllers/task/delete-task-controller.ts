import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class DeleteTaskController implements IController {
  constructor (
    private readonly validateTaskParam: IValidator,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = httpRequest.params

    const error = await this.validateTaskParam.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const deleted = await this.taskRepository.deleteTask(data.id, user.personal.id)

    if (!deleted) return this.httpHelper.badRequest(new TaskNotFoundError())

    return this.httpHelper.deleted()
  }
}
