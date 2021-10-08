import {
  createTaskController,
  findAllTasksController,
  findOneTaskController,
  protectedMiddleware
} from '.'

import { Router } from 'express'

const router = Router()

router.get('/:id', protectedMiddleware, findOneTaskController)
router.get('/', protectedMiddleware, findAllTasksController)
router.post('/', protectedMiddleware, createTaskController)

export default router
