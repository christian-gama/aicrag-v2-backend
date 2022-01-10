import {
  getMeController,
  logoutController,
  protectedMiddleware,
  updateEmailByPinController,
  updateMeController,
  updatePasswordController,
  userMiddleware
} from '.'
import { Router } from 'express'

const router = Router()

router.get('/get-me', protectedMiddleware, userMiddleware, getMeController)
router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-email-by-pin', protectedMiddleware, userMiddleware, updateEmailByPinController)
router.patch('/update-password', protectedMiddleware, userMiddleware, updatePasswordController)
router.patch('/update-me', protectedMiddleware, userMiddleware, updateMeController)

export default router
