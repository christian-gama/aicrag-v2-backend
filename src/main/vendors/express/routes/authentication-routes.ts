import { Router } from 'express'
import {
  accessTokenMiddleware,
  activateAccountController,
  isLoggedInMiddleware,
  loginController,
  signUpController
} from '.'

const router = Router()

router.use(isLoggedInMiddleware)

router.post('/activate-account', accessTokenMiddleware, activateAccountController)
router.post('/login', loginController)
router.post('/signup', signUpController)

export default router
