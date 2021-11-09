import {
  logoutController,
  protectedMiddleware,
  updateEmailByPinController,
  updatePassword,
  updateUserController,
  userMiddleware
} from '.'
import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-pin', protectedMiddleware, userMiddleware, updateEmailByPinController)
router.patch('/update-password', protectedMiddleware, userMiddleware, updatePassword)
router.patch('/update-user', protectedMiddleware, userMiddleware, updateUserController)

export default router
