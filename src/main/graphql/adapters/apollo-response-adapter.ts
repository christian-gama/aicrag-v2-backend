import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpResponse } from '@/presentation/http/protocols'

import { getHttpResponse } from '../utils'

export const apolloResponseAdapter = async (
  controller: ControllerProtocol,
  args: any
): Promise<HttpResponse> => {
  const request = { body: { ...args } }

  const _response = await controller.handle(request)

  const response = getHttpResponse(_response) as HttpResponse

  return response
}
