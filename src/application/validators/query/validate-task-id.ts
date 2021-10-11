import { ValidatorProtocol } from '@/domain/validators'

import { InvalidQueryError } from '@/application/errors'

export class ValidateTaskId implements ValidatorProtocol {
  async validate (input: any): Promise<InvalidQueryError | undefined> {
    if (!input.taskId) return

    if (typeof input.taskId !== 'string') return new InvalidQueryError('taskId')

    if (input.taskId.length > 120) return new InvalidQueryError('taskId')
  }
}
