import { GetAllInvoicesController } from '@/presentation/controllers/invoice'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { makeTryCatchDecorator } from '@/factories/decorators'
import { makeHttpHelper } from '@/factories/helpers'
import { makeInvoiceRepository } from '@/factories/repositories'
import { makeQueryAllInvoicesValidatorComposite } from '@/factories/validators/query'

export const makeGetAllInvoicesController = (): ControllerProtocol => {
  const httpHelper = makeHttpHelper()
  const invoiceRepository = makeInvoiceRepository()
  const queryAllInvoicesValidator = makeQueryAllInvoicesValidatorComposite()

  const getInvoiceByController = new GetAllInvoicesController(
    httpHelper,
    invoiceRepository,
    queryAllInvoicesValidator
  )

  return makeTryCatchDecorator(getInvoiceByController)
}
