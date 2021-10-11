import { getInvoiceByMonthController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/get-invoice-by-month', getInvoiceByMonthController)

export default router
