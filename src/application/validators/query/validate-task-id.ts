import { IValidator } from '@/domain/validators'
import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  async validate (input: Record<string, any>): Promise<InvalidTypeError | InvalidParamError | undefined> {
    const { taskId } = input

    if (!taskId) return

    if (typeof taskId !== 'string') return new InvalidTypeError('taskId', 'string', typeof taskId)

    if (taskId.length > 120) return new InvalidParamError('taskId')
  }
}
