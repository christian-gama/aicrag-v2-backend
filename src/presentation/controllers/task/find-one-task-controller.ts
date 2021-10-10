import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class FindOneTaskController implements ControllerProtocol {
  constructor (
    private readonly validateTaskParam: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly taskRepository: TaskRepositoryProtocol
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
