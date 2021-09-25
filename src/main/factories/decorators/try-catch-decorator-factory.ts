import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { LogDecorator } from '@/main/decorators/log-decorator'
import { TryCatchDecorator } from '@/main/decorators/try-catch-decorator'

import { makeLogDecorator } from '.'

type TryCatchProtocol = ControllerProtocol | MiddlewareProtocol
type LogDecoratorProtocol = LogDecorator<TryCatchProtocol>

export const makeTryCatchDecorator = <T extends TryCatchProtocol>(fn: T): LogDecoratorProtocol => {
  // LogDecorator must decorate TryCatchDecorator - this way saves the error on DB.
  return makeLogDecorator(new TryCatchDecorator<T>(fn))
}
