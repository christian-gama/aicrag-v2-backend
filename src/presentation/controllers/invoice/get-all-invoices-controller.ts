import { IInvoiceRepository, IQueryAllInvoices } from '@/domain/repositories/invoice'
import { IValidator } from '@/domain/validators'

import { MustLoginError } from '@/application/errors'

import { HttpHelperProtocol, HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { IController } from '../protocols/controller-protocol'

export class GetAllInvoicesController implements IController {
  constructor (
    private readonly getAllInvoicesValidator: IValidator,
    private readonly httpHelper: HttpHelperProtocol,
    private readonly invoiceRepository: IInvoiceRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.getAllInvoicesValidator.validate(httpRequest.query)
    if (error) return this.httpHelper.badRequest(error)

    const query = httpRequest.query as IQueryAllInvoices

    const allInvoices = await this.invoiceRepository.getAll(query, user.personal.id)

    const result = this.httpHelper.ok({
      count: allInvoices.count,
      displaying: allInvoices.displaying,
      documents: allInvoices.documents,
      page: allInvoices.page
    })

    return result
  }
}
