import { Router } from 'express'
import { adaptRoutes } from '../adapters/express/adapt-routes'
import { makeLoginController } from '../factories/controllers/login/login-controller-factory'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
const router = Router()

router.post('/signup', adaptRoutes(makeSignUpController()))
router.post('/login', adaptRoutes(makeLoginController()))

export default router
