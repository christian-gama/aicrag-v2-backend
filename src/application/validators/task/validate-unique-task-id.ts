import { ITaskRepository } from '@/domain/repositories/task'
import { IValidator } from '@/domain/validators'
import { ConflictParamError } from '@/application/errors'

export class ValidateUniqueTaskId implements IValidator {
  constructor (private readonly taskRepository: ITaskRepository) {}

  async validate (input: any): Promise<ConflictParamError | undefined> {
    if (!input.taskId) return

    const task = await this.taskRepository.findByTaskId(input.taskId, input.user.personal.id)
    if (task) return new ConflictParamError('taskId')
  }
}
