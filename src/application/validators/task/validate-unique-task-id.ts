import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { ConflictParamError, InvalidTypeError } from '@/application/errors'

export class ValidateUniqueTaskId implements IValidator {
  constructor (private readonly taskRepository: ITaskRepository) {}

  async validate (input: Record<string, any>): Promise<InvalidTypeError | ConflictParamError | undefined> {
    const { taskId, user } = input

    if (!taskId) return

    if (typeof taskId !== 'string') {
      return new InvalidTypeError('taskId', 'string', typeof taskId)
    }

    const task = await this.taskRepository.findByTaskId(taskId, user.personal.id)
    if (task) return new ConflictParamError('taskId')
  }
}
