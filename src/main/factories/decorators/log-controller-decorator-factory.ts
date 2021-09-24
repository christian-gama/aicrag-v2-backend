import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { LogControllerDecorator } from '@/main/decorators/log-controller-decorator'

import { makeLogErrorDbRepository } from '../repositories'

export const makeLogControllerDecorator = (controller: ControllerProtocol): LogControllerDecorator => {
  const logErrorDbRepository = makeLogErrorDbRepository()

  return new LogControllerDecorator(controller, logErrorDbRepository)
}
