import { getAllInvoicesController, getInvoiceByMonthController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/get-all-invoices', getAllInvoicesController)
router.get('/get-invoice-by-month', getInvoiceByMonthController)

export default router
