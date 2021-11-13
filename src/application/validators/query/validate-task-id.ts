import { IValidator } from '@/domain/validators'
import { InvalidParamError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidParamError | undefined> {
    const { taskId } = input

    if (!taskId) return

    if (typeof taskId !== 'string') return new InvalidParamError('taskId')

    if (taskId.length > 120) return new InvalidParamError('taskId')
  }
}
