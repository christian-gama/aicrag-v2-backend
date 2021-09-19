import { routeAdapter } from '@/main/vendors/express/adapters/route-adapter'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'

import { Router } from 'express'
import { middlewareAdapter } from '../adapters/middleware-adapter'
import { makeVerifyRefreshToken } from '@/main/factories/middlewares/authentication/verify-refresh-token'
import { makeVerifyAccessToken } from '@/main/factories/middlewares/authentication/verify-access-token'

const router = Router()

router.post('/activate-account', routeAdapter(makeActivateAccountController()))
router.post('/login', routeAdapter(makeLoginController()))
router.post('/signup', routeAdapter(makeSignUpController()))

router.get('/teste', middlewareAdapter(makeVerifyRefreshToken()), middlewareAdapter(makeVerifyAccessToken()), (req, res) => {
  res.json({ message: 'uhu' })
})

export default router
