import {
  loginController,
  accessTokenMiddleware,
  activateAccountController,
  forgotPasswordController,
  resetPasswordController
} from '.'

import { Router } from 'express'

const router = Router()

router.post('/', loginController)
router.post('/activate-account', accessTokenMiddleware, activateAccountController)
router.post('/forgot-password', forgotPasswordController)
router.post('/reset-password', resetPasswordController)

export default router
