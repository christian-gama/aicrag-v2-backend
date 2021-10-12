import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeInvoiceRepository } from '@/factories/repositories'
import { makeInvoiceByMonthValidator } from '@/factories/validators/query/invoice-by-month-validator-factory'

export const makeGetInvoiceByMonthController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const getInvoiceByMonthValidator = makeInvoiceByMonthValidator()

  const getInvoiceByController = new GetInvoiceByMonthController(
    getInvoiceByMonthValidator,
    httpHelper,
    invoiceRepository
  )

  return makeTryCatchDecorator(getInvoiceByController)
}
