import { signUpController } from '.'
import { Router } from 'express'

const router = Router()

router.post('/', signUpController)

export default router
