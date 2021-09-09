import { Router } from 'express'
import { adaptRoutes } from '../adapters/express/adapt-routes'
import { makeSignUpController } from '../factories/controllers/signup/signup-controller-factory'
const router = Router()

router.post('/signup', adaptRoutes(makeSignUpController()))

export default router
