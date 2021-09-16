import { InternalError } from '@/application/usecases/errors'
import { HttpResponse } from '@/presentation/helpers/http/protocols'

import { Response } from 'express'
import {
  createAccessTokenCookie,
  createRefreshTokenCookie
} from '@/main/vendors/express/helpers/create-token-cookie'

export const defaultResponse = (expressResponse: Response, httpResponse: HttpResponse): void => {
  expressResponse.json({
    status: httpResponse.status,
    data: httpResponse.data
  })
}

export const accessTokenResponse = (expressResponse: Response, httpResponse: HttpResponse): void => {
  createAccessTokenCookie(expressResponse, httpResponse)

  defaultResponse(expressResponse, httpResponse)
}

export const refreshTokenResponse = (
  expressResponse: Response,
  httpResponse: HttpResponse
): void => {
  createAccessTokenCookie(expressResponse, httpResponse)
  createRefreshTokenCookie(expressResponse, httpResponse)

  defaultResponse(expressResponse, httpResponse)
}

export const productionErrorResponse = (
  expressResponse: Response,
  httpResponse: HttpResponse
): void => {
  expressResponse.json({
    status: httpResponse.status,
    data: { message: new InternalError().message }
  })
}
