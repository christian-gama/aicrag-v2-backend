import { ITaskRepository } from '@/domain/repositories'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  constructor (private readonly taskRepository: ITaskRepository) {}

  async validate (input: any): Promise<InvalidParamError | InvalidTypeError | undefined> {
    if (input.taskId == null) return

    if (typeof input.taskId !== 'string') return new InvalidTypeError('taskId')

    if (input.taskId.length > 120) return new InvalidParamError('taskId')

    if (input.task && input.user) {
      const task = await this.taskRepository.findByTaskId(input.taskId, input.user.personal.id)

      if (task && task.id !== input.task.id) return new ConflictParamError('taskId')
    }
  }
}
