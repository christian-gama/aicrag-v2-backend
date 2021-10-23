import { GetAllInvoicesController } from '@/presentation/controllers/invoice'
import { IController } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeInvoiceRepository } from '@/factories/repositories'
import { makeAllInvoicesValidator } from '@/factories/validators/query'

export const makeGetAllInvoicesController = (): IController => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const getAllInvoicesValidator = makeAllInvoicesValidator()

  const getInvoiceByController = new GetAllInvoicesController(getAllInvoicesValidator, httpHelper, invoiceRepository)

  return makeTryCatchDecorator(getInvoiceByController)
}
