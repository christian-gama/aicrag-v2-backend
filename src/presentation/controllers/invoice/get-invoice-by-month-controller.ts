import { InvoiceRepositoryProtocol, QueryInvoiceProtocol } from '@/domain/repositories/invoice'
import { ValidatorProtocol } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { ControllerProtocol } from '../protocols/controller-protocol'

export class GetInvoiceByMonthController implements ControllerProtocol {
  constructor (
    private readonly httpHelper: HttpHelperProtocol,
    private readonly invoiceRepository: InvoiceRepositoryProtocol,
    private readonly queryInvoiceValidator: ValidatorProtocol
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user

    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.queryInvoiceValidator.validate(httpRequest.query)
    if (error) return this.httpHelper.badRequest(error)

    const query = httpRequest.query as QueryInvoiceProtocol

    const result = await this.invoiceRepository.getInvoiceByMonth(query, user.personal.id)

    return this.httpHelper.ok({
      count: result.count,
      displaying: result.displaying,
      documents: result.documents,
      page: result.page
    })
  }
}
