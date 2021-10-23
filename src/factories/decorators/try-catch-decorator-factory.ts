import { IController } from '@/presentation/controllers/protocols/controller-protocol'
import { LogDecorator, TryCatchDecorator } from '@/presentation/decorators'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { makeLogDecorator } from '.'

type TryCatchProtocol = IController | IMiddleware
type LogDecoratorProtocol = LogDecorator<TryCatchProtocol>

export const makeTryCatchDecorator = <T extends TryCatchProtocol>(fn: T): LogDecoratorProtocol => {
  // LogDecorator must decorate TryCatchDecorator - this way saves the error on DB.
  return makeLogDecorator(new TryCatchDecorator<T>(fn))
}
