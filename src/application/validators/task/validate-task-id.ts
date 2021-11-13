import { ITaskRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  constructor (private readonly taskRepository: ITaskRepository) {}

  async validate (input: Record<string, any>): Promise<InvalidParamError | InvalidTypeError | undefined> {
    const { taskId, task, user } = input

    if (!taskId) return

    if (typeof taskId !== 'string') return new InvalidTypeError('taskId', 'string', typeof taskId)

    if (taskId.length > 120) return new InvalidParamError('taskId')

    if (task && user) {
      const foundTask = await this.taskRepository.findByTaskId(taskId, user.personal.id)

      if (foundTask && foundTask.id !== task.id) return new ConflictParamError('taskId')
    }
  }
}
