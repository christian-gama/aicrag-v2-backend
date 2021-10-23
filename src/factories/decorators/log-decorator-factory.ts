import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { LogDecorator } from '@/presentation/decorators/log-decorator'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeLogErrorRepository } from '../repositories'

type TryCatchProtocol = IController | IMiddleware

export const makeLogDecorator = <T extends TryCatchProtocol>(fn: T): LogDecorator<T> => {
  const logErrorRepository = makeLogErrorRepository()

  return new LogDecorator<T>(fn, logErrorRepository)
}
