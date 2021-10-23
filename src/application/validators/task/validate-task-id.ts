import { IValidator } from '@/domain/validators'

import { InvalidParamError, InvalidTypeError } from '@/application/errors'

export class ValidateTaskId implements IValidator {
  validate (input: any): InvalidParamError | InvalidTypeError | undefined {
    if (input.taskId == null) return

    if (typeof input.taskId !== 'string') return new InvalidTypeError('taskId')

    if (input.taskId.length > 120) return new InvalidParamError('taskId')
  }
}
