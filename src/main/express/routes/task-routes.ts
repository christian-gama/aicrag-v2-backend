import {
  createTaskController,
  deleteTaskController,
  findAllTasksController,
  findOneTaskController,
  protectedMiddleware,
  updateTaskController,
  userMiddleware
} from '.'
import { Router } from 'express'

const router = Router()

router.delete('/:id', protectedMiddleware, userMiddleware, deleteTaskController)
router.get('/:id', protectedMiddleware, findOneTaskController)
router.get('/', protectedMiddleware, findAllTasksController)
router.patch('/:id', protectedMiddleware, userMiddleware, updateTaskController)
router.post('/', protectedMiddleware, userMiddleware, createTaskController)

export default router
