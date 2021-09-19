import { controllerAdapter } from '@/main/vendors/express/adapters/controller-adapter'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'

import { Router } from 'express'
import { tokenMiddlewareAdapter } from '../adapters/token-middleware-adapter'
import { makeRefreshToken } from '@/main/factories/middlewares/authentication/refresh-token'
import { makeAccessToken } from '@/main/factories/middlewares/authentication/access-token'

const router = Router()

router.post('/activate-account', controllerAdapter(makeActivateAccountController()))
router.post('/login', controllerAdapter(makeLoginController()))
router.post('/signup', controllerAdapter(makeSignUpController()))

router.get('/teste', tokenMiddlewareAdapter(makeRefreshToken()), tokenMiddlewareAdapter(makeAccessToken()), (req, res) => {
  res.json({ message: 'uhu' })
})

export default router
