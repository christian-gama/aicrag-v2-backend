import { IInvoiceRepository, IQueryInvoice } from '@/domain/repositories/invoice'
import { IValidator } from '@/domain/validators'
import { MustLoginError } from '@/application/errors'
import { IHttpHelper, HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IController } from '../protocols/controller.model'

export class GetInvoiceByMonthController implements IController {
  constructor (
    private readonly getInvoiceByMonthValidator: IValidator,
    private readonly httpHelper: IHttpHelper,
    private readonly invoiceRepository: IInvoiceRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const user = httpRequest.user
    if (!user) return this.httpHelper.unauthorized(new MustLoginError())

    const error = await this.getInvoiceByMonthValidator.validate(httpRequest.query)
    if (error) return this.httpHelper.badRequest(error)

    const query = httpRequest.query as IQueryInvoice

    const invoice = await this.invoiceRepository.getByMonth(query, user.personal.id)

    const result = this.httpHelper.ok({
      count: invoice.count,
      displaying: invoice.displaying,
      documents: invoice.documents,
      page: invoice.page
    })

    return result
  }
}
