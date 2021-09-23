import {
  isLoggedInMiddleware,
  accessTokenMiddleware,
  activateAccountController,
  forgotPasswordController,
  loginController,
  logoutController,
  signUpController
} from '.'

import { Router } from 'express'

const router = Router()

router.use(isLoggedInMiddleware)

router.post('/activate-account', accessTokenMiddleware, activateAccountController)
router.post('/forgot-password', forgotPasswordController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.post('/signup', signUpController)

export default router
