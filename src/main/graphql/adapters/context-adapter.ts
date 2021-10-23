import { HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { Request, Response } from 'express'

export const contextAdapter = async (middleware: IMiddleware, req: Request, res: Response): Promise<HttpResponse> => {
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
