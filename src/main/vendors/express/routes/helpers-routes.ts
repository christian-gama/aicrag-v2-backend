import { partialProtectedMiddleware, sendWelcomeEmailController, verifyResetPasswordTokenController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/verify-reset-password-token/:token', verifyResetPasswordTokenController)
router.post('/send-welcome-email/', partialProtectedMiddleware, sendWelcomeEmailController)

export default router