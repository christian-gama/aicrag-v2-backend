import {
  logoutController,
  protectedMiddleware,
  updateEmailByPinController,
  updatePassword,
  updateMeController,
  userMiddleware
} from '.'
import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-pin', protectedMiddleware, userMiddleware, updateEmailByPinController)
router.patch('/update-password', protectedMiddleware, userMiddleware, updatePassword)
router.patch('/update-me', protectedMiddleware, userMiddleware, updateMeController)

export default router
