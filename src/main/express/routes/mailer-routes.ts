import { sendEmailPinController, sendRecoverPasswordController, sendWelcomeEmailController } from '.'
import { Router } from 'express'

const router = Router()

router.post('/send-email-pin', sendEmailPinController)
router.post('/send-forgot-password-email/', sendRecoverPasswordController)
router.post('/send-welcome-email/', sendWelcomeEmailController)

export default router
