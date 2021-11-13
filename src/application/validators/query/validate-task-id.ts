import { IValidator } from '@/domain/validators'
import { InvalidQueryError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidQueryError | undefined> {
    const { taskId } = input

    if (!taskId) return

    if (typeof taskId !== 'string') return new InvalidQueryError('taskId')

    if (taskId.length > 120) return new InvalidQueryError('taskId')
  }
}
