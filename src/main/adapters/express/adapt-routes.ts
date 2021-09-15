import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/helpers/http/protocols'
import { env } from '@/main/config/env'
import {
  accessTokenResponse,
  defaultResponse,
  productionErrorResponse,
  refreshTokenResponse
} from './express-responses'

import { NextFunction, Request, Response } from 'express'

export const adaptRoutes = (controller: ControllerProtocol) => {
  return async (req: AdaptHttpRequest, res: AdaptHttpResponse, next: NextFunction) => {
    try {
      const httpResponseData = await controller.handle(req)

      res.status(httpResponseData.statusCode)

      if (httpResponseData.data.refreshToken) {
        return refreshTokenResponse(res, httpResponseData)
      }

      if (httpResponseData.data.accessToken) {
        return accessTokenResponse(res, httpResponseData)
      }

      if (httpResponseData.statusCode === 500 && env.SERVER.NODE_ENV === 'production') {
        return productionErrorResponse(res, httpResponseData)
      }

      return defaultResponse(res, httpResponseData)
    } catch (error) {
      next(error)
    }
  }
}

type AdaptHttpRequest = HttpRequest & Request
type AdaptHttpResponse = HttpResponse & Response
