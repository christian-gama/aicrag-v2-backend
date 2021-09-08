import { Router } from 'express'
import { adaptRoutes } from '../adapters/express/adapt-routes'
import { makeSignUpController } from '../factories/authentication/signup-controller-factory'
const router = Router()

router.post('/signup', adaptRoutes(makeSignUpController()))

export default router
