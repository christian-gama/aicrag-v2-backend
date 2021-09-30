import {
  sendEmailCodeController,
  sendForgotPasswordEmailController,
  sendWelcomeEmailController,
  verifyResetPasswordTokenController
} from '.'

import { Router } from 'express'

const router = Router()

router.get('/verify-reset-password-token/:token', verifyResetPasswordTokenController)
router.post('/send-email-code', sendEmailCodeController)
router.post('/send-forgot-password-email/', sendForgotPasswordEmailController)
router.post('/send-welcome-email/', sendWelcomeEmailController)

export default router
