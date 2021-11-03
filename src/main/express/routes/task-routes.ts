import {
  createTaskController,
  deleteTaskController,
  findAllTasksController,
  findOneTaskController,
  protectedMiddleware,
  updateTaskController
} from '.'
import { Router } from 'express'

const router = Router()

router.delete('/:id', protectedMiddleware, deleteTaskController)
router.get('/:id', protectedMiddleware, findOneTaskController)
router.get('/', protectedMiddleware, findAllTasksController)
router.patch('/:id', protectedMiddleware, updateTaskController)
router.post('/', protectedMiddleware, createTaskController)

export default router
