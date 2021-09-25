import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { defaultResponse } from '../helpers/express-responses'

import { Request, Response, NextFunction } from 'express'

export const tokenMiddlewareAdapter = (middleware: MiddlewareProtocol) => {
  return async (req: AdaptHttpRequest, res: Response, next: NextFunction) => {
    try {
      const httpResponse: HttpResponse = await middleware.handle(req)

      if (httpResponse.data.accessToken) {
        res.cookie('accessToken', httpResponse.data.accessToken, {
          httpOnly: true,
          secure: environment.SERVER.NODE_ENV === 'production'
        })

        req.cookies.accessToken = httpResponse.data.accessToken

        return next()
      }

      defaultResponse(res, httpResponse)
    } catch (error) {
      next(error)
    }
  }
}

type AdaptHttpRequest = Request & Pick<HttpRequest, 'cookies'>
