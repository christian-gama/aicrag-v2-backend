import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { LogDecorator } from '@/presentation/decorators/log-decorator'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeLogErrorRepository } from '../repositories'

type TryCatchProtocol = ControllerProtocol | MiddlewareProtocol

export const makeLogDecorator = <T extends TryCatchProtocol>(fn: T): LogDecorator<T> => {
  const logErrorRepository = makeLogErrorRepository()

  return new LogDecorator<T>(fn, logErrorRepository)
}
