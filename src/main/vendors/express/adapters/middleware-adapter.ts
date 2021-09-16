import { HttpRequestToken, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'
import { env } from '@/main/config/env'

import { Request, Response, NextFunction } from 'express'

export const middlewareAdapter = (middleware: MiddlewareProtocol) => {
  return async (req: AdaptHttpRequest, res: Response, next: NextFunction) => {
    try {
      const httpRequest: HttpRequestToken = {
        refreshToken: req.cookies?.refreshToken
      }

      const httpResponse: HttpResponse = await middleware.handle(httpRequest)

      if (String(httpResponse.statusCode).startsWith('2')) {
        res.cookie('jwt', httpResponse.data.accessToken, {
          httpOnly: true,
          secure: env.SERVER.NODE_ENV === 'production'
        })

        req.userId = httpResponse.data.userId

        return next()
      }

      res.status(httpResponse.statusCode).json({
        status: httpResponse.status,
        data: { message: httpResponse.data.message }
      })
    } catch (error) {
      next(error)
    }
  }
}

type AdaptHttpRequest = Request & { userId: string }
