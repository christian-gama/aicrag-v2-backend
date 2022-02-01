import { getAuthentication, verifyResetPasswordTokenController } from '.'
import { Router } from 'express'

const router = Router()

router.get('/verify-reset-password-token/:token', verifyResetPasswordTokenController)
router.get('/get-authentication', getAuthentication)

export default router
