import { TryCatchControllerDecorator } from '@/main/decorators/try-catch-controller-decorator'
import { ControllerProtocol } from '@/presentation/controllers/login'
import { makeLogControllerDecorator } from './log-controller-decorator-factory'

export const makeTryCatchControllerDecorator = (
  controller: ControllerProtocol
): ControllerProtocol => {
  // LogControllerDecorator must decorate TryCatchControllerDecorator - this way saves the error on DB.
  return makeLogControllerDecorator(new TryCatchControllerDecorator(controller))
}
