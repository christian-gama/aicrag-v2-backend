import { IInvoiceRepository, IQueryInvoice } from '@/domain/repositories/invoice'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class GetInvoiceByMonthController implements IController {
  constructor (
    private readonly getInvoiceByMonthValidator: IValidator,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly invoiceRepository: IInvoiceRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.getInvoiceByMonthValidator.validate(httpRequest.query)
    if (error) return this.httpHelper.badRequest(error)

    const query = httpRequest.query as IQueryInvoice

    const invoice = await this.invoiceRepository.getInvoiceByMonth(query, user.personal.id)

    const result = this.httpHelper.ok({
      count: invoice.count,
      displaying: invoice.displaying,
      documents: invoice.documents,
      page: invoice.page
    })

    return result
  }
}
