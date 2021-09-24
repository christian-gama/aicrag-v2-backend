import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { MiddlewareProtocol } from '@/presentation/middlewares/protocols/middleware-protocol'

import { environment } from '@/main/config/environment'

import { Request, Response, NextFunction } from 'express'

export const tokenMiddlewareAdapter = (middleware: MiddlewareProtocol) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpRequest: HttpRequest = Object.assign(
        {
          accessToken: req.cookies?.accessToken,
          refreshToken: req.cookies?.refreshToken
        },
        req
      )

      const httpResponse: HttpResponse = await middleware.handle(httpRequest)

      if (String(httpResponse.statusCode).startsWith('2')) {
        res.cookie('accessToken', httpResponse.data.accessToken, {
          httpOnly: true,
          secure: environment.SERVER.NODE_ENV === 'production'
        })

        req.cookies.accessToken = httpResponse.data.accessToken

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
