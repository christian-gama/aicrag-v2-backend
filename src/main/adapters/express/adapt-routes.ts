import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { env } from '@/main/config/env'

import { Request, Response } from 'express'

export const adaptRoutes = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = req

    const httpResponse: HttpResponse = await controller.handle(httpRequest)

    if (httpResponse.accessToken) {
      res.cookie('jwt', httpResponse.accessToken, {
        maxAge: +env.COOKIES.EXPIRES * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: env.SERVER.NODE_ENV === 'production'
      })
    }

    const jsonResponse = {
      status: httpResponse.status,
      data: httpResponse.data
    }

    res.status(httpResponse.statusCode)
    res.json(jsonResponse)
  }
}
