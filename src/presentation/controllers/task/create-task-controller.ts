import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller-protocol'

export class CreateTaskController implements IController {
  constructor (
    private readonly createTaskValidator: IValidator,
    private readonly httpHelper: IHttpHelper,
    private readonly taskRepository: ITaskRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const data = Object.assign({ user }, httpRequest.body)

    const error = await this.createTaskValidator.validate(data)
    if (error) {
      switch (error.name) {
        case 'ConflictParamError':
          return this.httpHelper.conflict(error)
        default:
          return this.httpHelper.badRequest(error)
      }
    }

    const task = await this.taskRepository.save(data)

    const result = this.httpHelper.created({ task })

    return result
  }
}
