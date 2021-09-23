import { loginController, accessTokenMiddleware, activateAccountController, forgotPasswordController } from '.'
import { Router } from 'express'

const router = Router()

router.post('/', loginController)
router.post('/activate-account', accessTokenMiddleware, activateAccountController)
router.post('/forgot-password', forgotPasswordController)

export default router
