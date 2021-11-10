import { GetInvoiceByMonthController } from '@/presentation/controllers/invoice'
import { IController } from '@/presentation/controllers/protocols/controller.model'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeInvoiceRepository } from '@/main/factories/repositories'
import { makeInvoiceByMonthValidator } from '@/main/factories/validators/query/invoice-by-month-validator-factory'

export const makeGetInvoiceByMonthController = (): IController => {
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
