import { IUserRepository } from '@/domain/repositories'
import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError, TaskNotFoundError, UserNotFoundError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../../protocols/controller.model'

export class UpdateUserTaskController implements IController {
  constructor (
    private readonly httpHelper: IHttpHelper,
    private readonly taskRepository: ITaskRepository,
    private readonly userRepository: IUserRepository,
    private readonly validateCommentary: IValidator,
    private readonly validateDate: IValidator,
    private readonly validateDuration: IValidator,
    private readonly validateStatus: IValidator,
    private readonly validateTaskId: IValidator,
    private readonly validateUUID: IValidator,
    private readonly validateType: IValidator,
    private readonly validateUniqueTaskId: IValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const params = httpRequest.params

    const error = await this.validateUUID.validate(params)
    if (error) return this.httpHelper.badRequest(error)

    const task = await this.taskRepository.superFindById(params.id)
    if (!task) return this.httpHelper.badRequest(new TaskNotFoundError())

    const taskOwner = await this.userRepository.findById(task.user)
    if (!taskOwner) return this.httpHelper.badRequest(new UserNotFoundError())

    const data = { ...httpRequest.body, task, user: taskOwner }

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
          ? (data.duration / 60) * 65 * taskOwner.settings.handicap
          : (data.duration / 60) * 112.5 * taskOwner.settings.handicap
    }

    if (data.status && data.status !== task.status) {
      const error = await this.validateStatus.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      update.status = data.status
    }

    if (data.taskId && data.taskId !== task.taskId) {
      let error = await this.validateTaskId.validate(data)
      if (error) return this.httpHelper.badRequest(error)

      error = await this.validateUniqueTaskId.validate(data)
      if (error) return this.httpHelper.conflict(error)

      update.taskId = data.taskId
    }

    const isEmpty = Object.keys(update).length === 0
    if (isEmpty) return this.httpHelper.ok({ message: 'No changes were made' })
    else update['logs.updatedAt'] = new Date(Date.now())

    const updatedTask = await this.taskRepository.superUpdateById(task.id, update)
    if (!updatedTask) return this.httpHelper.badRequest(new TaskNotFoundError())

    const result = this.httpHelper.ok({ task: updatedTask })

    return result
  }
}
