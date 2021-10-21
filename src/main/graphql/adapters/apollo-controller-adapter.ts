import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpResponse } from '@/presentation/http/protocols'

import {
  createAccessTokenCookie,
  createRefreshTokenCookie
} from '@/main/express/handlers/create-token-cookie'

import { getHttpResponse } from '../utils'

export const apolloControllerAdapter = async (
  controller: ControllerProtocol,
  args: any,
  context?: any
): Promise<HttpResponse> => {
  const { req, res } = context
  const request = { ...req, body: { ...(args.input || args) } }

  const _response = await controller.handle(request)

  const response = getHttpResponse(_response) as HttpResponse

  if (response.data.refreshToken) {
    createRefreshTokenCookie(res, response)
  }

  if (response.data.accessToken) {
    createAccessTokenCookie(res, response)
  }

  return response
}
