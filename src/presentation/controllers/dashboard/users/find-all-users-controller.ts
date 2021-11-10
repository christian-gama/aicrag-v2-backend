import { IUserRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { HttpRequest, HttpResponse, IHttpHelper } from '@/presentation/http/protocols'

export class FindAllUsersController {
  constructor (
    private readonly findAllUsersValidator: IValidator,
    private readonly httpHelper: IHttpHelper,
    private readonly userRepository: IUserRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.user) {
      return this.httpHelper.unauthorized(new MustLoginError())
    }

    const query = httpRequest.query
    const error = await this.findAllUsersValidator.validate(query)
    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const users = await this.userRepository.findAll(query)

    const result = this.httpHelper.ok({
      count: users.count,
      displaying: users.displaying,
      documents: users.documents,
      page: users.page
    })

    return result
  }
}
