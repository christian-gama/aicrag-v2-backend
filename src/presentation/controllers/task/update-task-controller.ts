import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError, TaskNotFoundError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class UpdateTaskController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly taskDbRepository: TaskDbRepositoryProtocol,
    private readonly validateCommentary: ValidatorProtocol,
    private readonly validateDate: ValidatorProtocol,
    private readonly validateTaskParam: ValidatorProtocol,
    private readonly validateType: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body
    const params = httpRequest.params
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.validateTaskParam.validate(params)
    if (error) return this.httpHelper.badRequest(error)

    const task = await this.taskDbRepository.findTaskById(params.id, user.personal.id)
    if (!task) return this.httpHelper.badRequest(new TaskNotFoundError())

    const update: Record<string, any> = {}

    if (data.commentary) {
      const error = await this.validateCommentary.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update.commentary = data.commentary
    }

    if (data.date) {
      const error = await this.validateDate.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      const date = data.date

      update['date.day'] = date.getDate()
      update['date.full'] = data.date
      update['date.hours'] = date.toLocaleTimeString()
      update['date.month'] = date.getMonth()
      update['date.year'] = date.getYear()
    }

    if (data.type) {
      if (!data.type) data.type = task?.type

      const error = await this.validateType.validate(data)
      if (error) return this.httpHelper.badRequest(error)
    }

    const updatedTask = await this.taskDbRepository.updateTask(task, update)

    return this.httpHelper.ok({ task: updatedTask })
  }
}
