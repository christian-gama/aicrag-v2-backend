import { verifyResetPasswordTokenController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/verify-reset-password-token/:token', verifyResetPasswordTokenController)

export default router
