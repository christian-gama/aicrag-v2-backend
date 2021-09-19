import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'
import { makeVerifyRefreshToken } from '@/main/factories/providers/token/verify-refresh-token-factory'
import { isLoggedInMiddlewareAdapter } from '../adapters/is-logged-in-middleware-adapter'

import { Router } from 'express'

const router = Router()

const activateAccountController = controllerAdapter(makeActivateAccountController())
const loginController = controllerAdapter(makeLoginController())
const signUpController = controllerAdapter(makeSignUpController())
const isLoggedIn = isLoggedInMiddlewareAdapter(makeVerifyRefreshToken())

router.use(isLoggedIn)

router.post('/activate-account', activateAccountController)
router.post('/login', loginController)
router.post('/signup', signUpController)

export default router
