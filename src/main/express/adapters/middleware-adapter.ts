import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { IMiddleware } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { defaultResponse } from '../handlers/express-responses'

import { Request, Response, NextFunction } from 'express'

type AdaptRequest = Request & Pick<HttpRequest, 'user' | 'headers'>

export const middlewareAdapter = (middleware: IMiddleware) => {
  return async (req: AdaptRequest, res: Response, next: NextFunction) => {
    try {
      const httpResponse: HttpResponse = await middleware.handle(req)

      if (httpResponse.statusCode === 401) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')

        return defaultResponse(res, httpResponse)
      }

      if (httpResponse.statusCode === 500) {
        return defaultResponse(res, httpResponse)
      }

      if (httpResponse.data.refreshToken) {
        res.cookie('accessToken', httpResponse.data.accessToken, {
          httpOnly: true,
          secure: environment.SERVER.NODE_ENV === 'production'
        })

        req.headers['X-Access-Token'] = httpResponse.data.accessToken

        req.cookies.accessToken = httpResponse.data.accessToken
      }

      if (httpResponse.data.user) req.user = httpResponse.data.user

      next()
    } catch (error) {
      next(error)
    }
  }
}
