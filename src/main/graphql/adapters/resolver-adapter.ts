import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

export const resolverAdapter = async (controller: ControllerProtocol, args: any): Promise<any> => {
  const httpResponse = await controller.handle(args)

  return httpResponse
}
