import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { TryCatchControllerDecorator } from '@/main/decorators/try-catch-controller-decorator'

import { makeLogControllerDecorator } from '.'

export const makeTryCatchControllerDecorator = (
  controller: ControllerProtocol
): ControllerProtocol => {
  // LogControllerDecorator must decorate TryCatchControllerDecorator - this way saves the error on DB.
  return makeLogControllerDecorator(new TryCatchControllerDecorator(controller))
}
