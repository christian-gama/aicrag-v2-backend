import { IController } from '@/presentation/controllers/protocols/controller.model'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { createAccessTokenCookie, createRefreshTokenCookie } from '@/main/express/handlers/create-token-cookie'
import { getHttpResponse } from '../utils'

export const resolverAdapter = async (controller: IController, args: any, context?: any): Promise<any> => {
  const { req, res } = context
  const request: HttpRequest = {
    ...req,
    body: { ...(args.input || args) },
    headers: { ...req.headers },
    params: { ...(args.param || args) },
    query: { ...(args.query || args) }
  }

  const _response = await controller.handle(request)

  const response = getHttpResponse(_response) as HttpResponse

  if (response.data.refreshToken) createRefreshTokenCookie(res, response)
  if (response.data.accessToken) createAccessTokenCookie(res, response)

  return response.data
}
