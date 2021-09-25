import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { LogDecorator } from '@/main/decorators/log-decorator'

import { makeLogErrorDbRepository } from '../repositories'

type TryCatchProtocol = ControllerProtocol | MiddlewareProtocol

export const makeLogDecorator = <T extends TryCatchProtocol>(fn: T): LogDecorator<T> => {
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new LogDecorator<T>(fn, logErrorDbRepository)
}
