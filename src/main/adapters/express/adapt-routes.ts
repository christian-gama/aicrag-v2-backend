import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { env } from '@/main/config/env'

import { NextFunction, Request, Response } from 'express'
import { InternalError } from '@/application/usecases/errors'

export const adaptRoutes = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpRequest: HttpRequest = req

      const httpResponse: HttpResponse = await controller.handle(httpRequest)

      if (httpResponse.accessToken) {
        res.cookie('jwt', httpResponse.accessToken, {
          maxAge: +env.COOKIES.EXPIRES * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: env.SERVER.NODE_ENV === 'production'
        })
      }

      res.status(httpResponse.statusCode)

      if (httpResponse.statusCode === 500 && env.SERVER.NODE_ENV === 'production') {
        res.json({
          status: httpResponse.status,
          data: { message: new InternalError().message }
        })
      } else {
        res.json({
          status: httpResponse.status,
          data: httpResponse.data
        })
      }
    } catch (error) {
      next(error)
    }
  }
}
