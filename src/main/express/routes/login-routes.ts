import {
  loginController,
  activateAccountController,
  forgotPasswordController,
  resetPasswordController,
  partialProtectedMiddleware
} from '.'
import { Router } from 'express'

const router = Router()

router.post('/', loginController)
router.patch('/activate-account', partialProtectedMiddleware, activateAccountController)
router.post('/forgot-password', forgotPasswordController)
router.patch('/reset-password', partialProtectedMiddleware, resetPasswordController)

export default router
