import { Router } from 'express'
import { isLoggedInMiddleware, activateAccountController, loginController, signUpController } from '.'

const router = Router()

router.use(isLoggedInMiddleware)

router.post('/activate-account', activateAccountController)
router.post('/login', loginController)
router.post('/signup', signUpController)

export default router
