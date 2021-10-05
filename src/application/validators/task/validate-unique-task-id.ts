import { TaskDbRepositoryProtocol } from '@/domain/repositories/task/task-db-repository-protocol'
import { ValidatorProtocol } from '@/domain/validators'

import { ConflictParamError } from '@/application/errors'

export class ValidateUniqueTaskId implements ValidatorProtocol {
  constructor (private readonly taskDbRepository: TaskDbRepositoryProtocol) {}

  async validate (input: any): Promise<ConflictParamError | undefined> {
    if (!input.taskId) return

    const task = await this.taskDbRepository.findTaskByTaskId(input.taskId, input.user.personal.id)

    if (task) return new ConflictParamError('taskId')
  }
}
