import { TaskRepositoryProtocol } from '@/domain/repositories/task'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError } from '@/application/errors'

export class ValidateUniqueTaskId implements ValidatorProtocol {
  constructor (private readonly taskRepository: TaskRepositoryProtocol) {}

  async validate (input: any): Promise<ConflictParamError | undefined> {
    if (!input.taskId) return

    const task = await this.taskRepository.findTaskByTaskId(input.taskId, input.user.personal.id)

    if (task) return new ConflictParamError('taskId')
  }
}
