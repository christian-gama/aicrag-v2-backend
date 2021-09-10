import { env } from '@/main/config/env'
import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { Request, Response } from 'express'

export const adaptRoutes = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = req

    const httpResponse: HttpResponse = await controller.handle(httpRequest)

    if (httpResponse.accessToken) {
      res.cookie('jwt', httpResponse.accessToken, {
        maxAge: +env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: env.NODE_ENV === 'production'
      })
    }

    res.status(httpResponse.statusCode)
    res.json(httpResponse.data)
  }
}
