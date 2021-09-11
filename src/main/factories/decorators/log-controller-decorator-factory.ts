import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'
import { ControllerProtocol } from '@/presentation/controllers/login'
import { makeLogErrorDbRepository } from '../repositories/log/log-error-db-repository/log-error-db-repository-factory'

export const makeLogControllerDecorator = (
  controller: ControllerProtocol
): LogControllerDecorator => {
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new LogControllerDecorator(controller, logErrorDbRepository)
}
