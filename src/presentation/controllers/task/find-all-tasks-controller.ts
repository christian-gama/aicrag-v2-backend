import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class FindAllTasksController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly queryValidator: ValidatorProtocol,
    private readonly taskRepository: TaskRepositoryProtocol
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
      documents: result.documents,
      page: `${result.currentPage} of ${result.totalPages}`
    })
  }
}
