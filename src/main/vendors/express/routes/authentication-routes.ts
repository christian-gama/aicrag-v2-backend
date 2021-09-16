import { routeAdapter } from '@/main/vendors/express/adapters/route-adapter'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'

import { Router } from 'express'

const router = Router()

router.post('/activate-account', routeAdapter(makeActivateAccountController()))
router.post('/login', routeAdapter(makeLoginController()))
router.post('/signup', routeAdapter(makeSignUpController()))

export default router
