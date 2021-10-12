import { InvoiceRepositoryProtocol, QueryAllInvoicesProtocol } from '@/domain/repositories/invoice'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class GetAllInvoicesController implements ControllerProtocol {
  constructor (
    private readonly getAllInvoicesValidator: ValidatorProtocol,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly invoiceRepository: InvoiceRepositoryProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.getAllInvoicesValidator.validate(httpRequest.query)
    if (error) {
      return this.httpHelper.badRequest(error)
    }

    const query = httpRequest.query as QueryAllInvoicesProtocol

    const result = await this.invoiceRepository.getAllInvoices(query, user.personal.id)

    return this.httpHelper.ok({
      count: result.count,
      displaying: result.displaying,
      documents: result.documents,
      page: result.page
    })
  }
}
