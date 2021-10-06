import { createTaskController, findOneTaskController, protectedMiddleware } from '.'

import { Router } from 'express'

const router = Router()

router.get('/:id', protectedMiddleware, findOneTaskController)
router.post('/', protectedMiddleware, createTaskController)

export default router
