import { IValidator } from '@/domain/validators'
import { HttpRequest, HttpResponse, IHttpHelper } from '@/presentation/http/protocols'
import { IController } from '../../protocols/controller.model'

export class UpdateUserController implements IController {
  constructor (private readonly httpHelper: IHttpHelper, private readonly validateName: IValidator) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const data = httpRequest.body

    if (data.name) {
      const error = await this.validateName.validate(data.name)
      if (error) {
        return this.httpHelper.badRequest(error)
      }
    }

    return this.httpHelper.ok({})
  }
}
