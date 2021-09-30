import { logoutController } from '.'

import { Router } from 'express'

const router = Router()

router.get('/logout', logoutController)

export default router
