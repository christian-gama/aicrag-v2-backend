import { ok } from '@/presentation/http/http'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

export class SignUpController {
  async handle (request: HttpRequest): Promise<HttpResponse> {
    return Promise.resolve(ok({}))
  }
}
