import {
  logoutController,
  protectedMiddleware,
  updateEmailByCodeController,
  updatePersonalController
} from '.'

import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-code', protectedMiddleware, updateEmailByCodeController)
router.patch('/update-personal', protectedMiddleware, updatePersonalController)

export default router
