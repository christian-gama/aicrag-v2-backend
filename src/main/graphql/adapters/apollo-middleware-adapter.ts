import { HttpResponse, HttpRequest } from '@/presentation/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { Request, Response } from 'express'

export const apolloMiddlewareAdapter = async (
  middleware: MiddlewareProtocol,
  req: AdaptRequest,
  res: Response
): Promise<HttpResponse> => {
  const httpResponse = await middleware.handle(req)

  if (httpResponse.data.refreshToken) {
    res.cookie('accessToken', httpResponse.data.accessToken, {
      httpOnly: true,
      secure: environment.SERVER.NODE_ENV === 'production'
    })

    req.cookies.accessToken = httpResponse.data.accessToken
  }

  return httpResponse
}
type AdaptRequest = Request & Pick<HttpRequest, 'user'>
