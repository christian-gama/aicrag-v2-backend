import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { defaultResponse } from '../helpers/express-responses'

import { Request, Response, NextFunction } from 'express'

type AdaptRequest = Request & Pick<HttpRequest, 'user'>

export const middlewareAdapter = (middleware: MiddlewareProtocol) => {
  return async (req: AdaptRequest, res: Response, next: NextFunction) => {
    try {
      const httpResponse: HttpResponse = await middleware.handle(req)

      if (httpResponse.statusCode === 401) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        return defaultResponse(res, httpResponse)
      }

      if (httpResponse.data.refreshToken) {
        res.cookie('accessToken', httpResponse.data.accessToken, {
          httpOnly: true,
          secure: environment.SERVER.NODE_ENV === 'production'
        })

        req.cookies.accessToken = httpResponse.data.accessToken
      }

      if (httpResponse.data.user) req.user = httpResponse.data.user

      next()
    } catch (error) {
      next(error)
    }
  }
}
