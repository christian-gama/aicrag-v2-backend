import {
  sendEmailCodeController,
  sendForgotPasswordEmailController,
  sendWelcomeEmailController
} from '.'

import { Router } from 'express'

const router = Router()

router.post('/send-email-code', sendEmailCodeController)
router.post('/send-forgot-password-email/', sendForgotPasswordEmailController)
router.post('/send-welcome-email/', sendWelcomeEmailController)

export default router
