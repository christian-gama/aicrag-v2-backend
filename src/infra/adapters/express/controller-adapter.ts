import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'

import { environment } from '@/main/config/environment'

import {
  refreshTokenResponse,
  accessTokenResponse,
  productionErrorResponse,
  defaultResponse
} from '../../../main/express/handlers/express-responses'

import { NextFunction, Request, Response } from 'express'

export const controllerAdapter = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpResponseData = await controller.handle(req)

      res.status(httpResponseData.statusCode)

      if (httpResponseData.data.refreshToken) {
        return refreshTokenResponse(res, httpResponseData)
      }

      if (httpResponseData.data.accessToken) {
        return accessTokenResponse(res, httpResponseData)
      }

      if (httpResponseData.statusCode === 500 && environment.SERVER.NODE_ENV === 'production') {
        return productionErrorResponse(res, httpResponseData)
      }

      return defaultResponse(res, httpResponseData)
    } catch (error) {
      next(error)
    }
  }
}
