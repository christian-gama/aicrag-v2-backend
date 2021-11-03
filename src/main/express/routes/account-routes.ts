import {
  logoutController,
  protectedMiddleware,
  updateEmailByPinController,
  updatePassword,
  updateUserController
} from '.'
import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-pin', protectedMiddleware, updateEmailByPinController)
router.patch('/update-password', protectedMiddleware, updatePassword)
router.patch('/update-user', protectedMiddleware, updateUserController)

export default router
