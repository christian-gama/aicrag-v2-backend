import { adaptRoutes } from '@/main/adapters/express/adapt-routes'
import { makeActivateAccountController } from '@/main/factories/controllers/authentication/activate-account/activate-account-controller-factory'
import { makeLoginController } from '@/main/factories/controllers/authentication/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/authentication/signup/signup-controller-factory'

import { Router } from 'express'

const router = Router()

router.post('/activate-account', adaptRoutes(makeActivateAccountController()))
router.post('/login', adaptRoutes(makeLoginController()))
router.post('/signup', adaptRoutes(makeSignUpController()))

export default router
