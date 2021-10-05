import { createTaskController, protectedMiddleware } from '.'

import { Router } from 'express'

const router = Router()

router.post('/', protectedMiddleware, createTaskController)

export default router
