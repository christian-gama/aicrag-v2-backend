import { Router } from 'express'
import {
  accessTokenMiddleware,
  activateAccountController,
  forgotPasswordController,
  isLoggedInMiddleware,
  loginController,
  logoutController,
  signUpController
} from '.'

const router = Router()

router.use(isLoggedInMiddleware)

router.post('/activate-account', accessTokenMiddleware, activateAccountController)
router.post('/forgot-password', forgotPasswordController)
router.post('/login', loginController)
router.get('/logout', logoutController)
router.post('/signup', signUpController)

export default router
