import {
  logoutController,
  protectedMiddleware,
  updateEmailByCodeController,
  updatePassword,
  updateUserController
} from '.'

import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-code', protectedMiddleware, updateEmailByCodeController)
router.patch('/update-password', protectedMiddleware, updatePassword)
router.patch('/update-user', protectedMiddleware, updateUserController)

export default router
