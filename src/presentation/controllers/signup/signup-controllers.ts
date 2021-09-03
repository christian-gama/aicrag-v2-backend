import { HttpRequest, HttpResponse } from '@presentation/http/protocols'

export class SignUpController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return { statusCode: 200, data: {} }
  }
}
