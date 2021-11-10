import { IController } from '@/presentation/controllers/protocols/controller.model'
import { LogDecorator } from '@/presentation/decorators/log-decorator'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware.model'
import { makeLogErrorRepository } from '../repositories'

type TryCatchProtocol = IController | IMiddleware

export const makeLogDecorator = <T extends TryCatchProtocol>(fn: T): LogDecorator<T> => {
  const logErrorRepository = makeLogErrorRepository()

  return new LogDecorator<T>(fn, logErrorRepository)
}
