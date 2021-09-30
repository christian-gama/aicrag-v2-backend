import { logoutController, protectedMiddleware, updatePersonalController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/logout', protectedMiddleware, logoutController)
router.patch('/update-personal', protectedMiddleware, updatePersonalController)

export default router
