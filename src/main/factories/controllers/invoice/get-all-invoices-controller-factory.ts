import { GetAllInvoicesController } from '@/presentation/controllers/invoice'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { makeTryCatchDecorator } from '@/main/factories/decorators'
import { makeHttpHelper } from '@/main/factories/helpers'
import { makeInvoiceRepository } from '@/main/factories/repositories'
import { makeAllInvoicesValidator } from '@/main/factories/validators/query'

export const makeGetAllInvoicesController = (): IController => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const getAllInvoicesValidator = makeAllInvoicesValidator()

  const getInvoiceByController = new GetAllInvoicesController(getAllInvoicesValidator, httpHelper, invoiceRepository)

  return makeTryCatchDecorator(getInvoiceByController)
}
