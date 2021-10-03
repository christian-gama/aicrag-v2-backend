import { ValidatorProtocol } from '@/domain/validators'

import { InvalidParamError } from '@/application/errors'

export class ValidateTaskId implements ValidatorProtocol {
  async validate (input: any): Promise<InvalidParamError | undefined> {
    if (input.taskId == null) return

    if (input.taskId.length > 120) return new InvalidParamError('taskId')
  }
}
