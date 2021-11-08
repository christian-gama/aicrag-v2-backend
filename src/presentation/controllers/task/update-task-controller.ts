import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, MustLoginError, TaskNotFoundError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller-protocol'

export class UpdateTaskController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly taskRepository: ITaskRepository,
    private readonly validateCommentary: IValidator,
    private readonly validateDate: IValidator,
    private readonly validateDuration: IValidator,
    private readonly validateStatus: IValidator,
    private readonly validateTaskId: IValidator,
    private readonly validateTaskParam: IValidator,
    private readonly validateType: IValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const params = httpRequest.params

    const error = await this.validateTaskParam.validate(params)
    if (error) return this.httpHelper.badRequest(error)

    const task = await this.taskRepository.findById(params.id, user.personal.id)
    if (!task) return this.httpHelper.badRequest(new TaskNotFoundError())

    const data = { ...httpRequest.body, task, user }

    const update: Record<string, any> = {}

    if (data.commentary && data.commentary !== task.commentary) {
      const error = await this.validateCommentary.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update.commentary = data.commentary
    }

    if (data.date && data.date !== task.date.full.toISOString()) {
      const error = await this.validateDate.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      const date = new Date(Date.parse(data.date))

      update['date.day'] = date.getUTCDate()
      update['date.full'] = date
      update['date.hours'] = date.toLocaleTimeString('pt-br', { timeZone: 'UTC' })
      update['date.month'] = date.getUTCMonth()
      update['date.year'] = date.getUTCFullYear()
    }

    if ((data.duration && data.duration !== task.duration) || (data.type && data.type !== task.type)) {
      if (!data.type) data.type = task?.type
      if (!data.duration) data.duration = task?.duration

      let error = await this.validateType.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      error = await this.validateDuration.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update.duration = data.duration
      update.type = data.type
      update.usd =
        data.type === 'TX'
          ? (data.duration / 60) * 65 * user.settings.handicap
          : (data.duration / 60) * 112.5 * user.settings.handicap
    }

    if (data.status && data.status !== task.status) {
      const error = await this.validateStatus.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update.status = data.status
    }

    if (data.taskId && data.taskId !== task.taskId) {
      const error = await this.validateTaskId.validate(data)
      if (error instanceof ConflictParamError) return this.httpHelper.conflict(error)
      if (error instanceof Error) return this.httpHelper.badRequest(error)

      update.taskId = data.taskId
    }

    const isEmpty = Object.keys(update).length === 0
    if (isEmpty) return this.httpHelper.ok({ message: 'No changes were made' })
    else update['logs.updatedAt'] = new Date(Date.now())

    const updatedTask = await this.taskRepository.updateById(task.id, user.personal.id, update)
    if (!updatedTask) return this.httpHelper.badRequest(new TaskNotFoundError())

    const result = this.httpHelper.ok({ task: updatedTask })

    return result
  }
}
