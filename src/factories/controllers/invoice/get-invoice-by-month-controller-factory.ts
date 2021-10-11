import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeInvoiceRepository } from '@/factories/repositories'
import { makeQueryInvoiceValidator } from '@/factories/validators/query/query-invoice-validator-factory'

export const makeGetInvoiceByMonthController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const queryInvoiceValidator = makeQueryInvoiceValidator()

  const getInvoiceByController = new GetInvoiceByMonthController(
    httpHelper,
    invoiceRepository,
    queryInvoiceValidator
  )

  return makeTryCatchDecorator(getInvoiceByController)
}
