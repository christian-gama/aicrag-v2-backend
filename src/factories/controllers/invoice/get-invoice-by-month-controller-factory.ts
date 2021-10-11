import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeInvoiceRepository } from '@/factories/repositories'
import { makeQueryInvoiceValidatorComposite } from '@/factories/validators/query/query-invoice-validator-composite-factory'

export const makeGetInvoiceByMonthController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const queryInvoiceValidator = makeQueryInvoiceValidatorComposite()

  const getInvoiceByController = new GetInvoiceByMonthController(
    httpHelper,
    invoiceRepository,
    queryInvoiceValidator
  )

  return makeTryCatchDecorator(getInvoiceByController)
}
