import { adaptRoutes } from '@/main/adapters/express/adapt-routes'
import { makeLoginController } from '@/main/factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '@/main/factories/controllers/signup/signup-controller-factory'

import { Router } from 'express'

const router = Router()

router.post('/login', adaptRoutes(makeLoginController()))
router.post('/signup', adaptRoutes(makeSignUpController()))

export default router
