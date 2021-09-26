import { sendWelcomeEmailController, verifyResetPasswordTokenController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/send-welcome-email/', sendWelcomeEmailController)
router.get('/verify-reset-password-token/:token', verifyResetPasswordTokenController)

export default router
