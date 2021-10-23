import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class FindOneTaskController implements IController {
  constructor (
    private readonly validateTaskParam: IValidator,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    const data = httpRequest.params

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.validateTaskParam.validate(data)
    if (error) return this.httpHelper.badRequest(error)

    const task = await this.taskRepository.findTaskById(data.id, user.personal.id)

    if (!task) return this.httpHelper.badRequest(new TaskNotFoundError())

    return this.httpHelper.ok({ task })
  }
}
