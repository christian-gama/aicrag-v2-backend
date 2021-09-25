import { InternalError } from '@/application/usecases/errors'

import { HttpResponse } from '@/presentation/helpers/http/protocols'

import { createAccessTokenCookie, createRefreshTokenCookie } from './create-token-cookie'

import { Response } from 'express'

export const accessTokenResponse = (res: Response, httpResponse: HttpResponse): void => {
  createAccessTokenCookie(res, httpResponse)

  defaultResponse(res, httpResponse)
}

export const defaultResponse = (res: Response, httpResponse: HttpResponse): void => {
  res.status(httpResponse.statusCode)
  res.json({
    status: httpResponse.status,
    data: httpResponse.data
  })
}

export const productionErrorResponse = (res: Response, httpResponse: HttpResponse): void => {
  res.status(httpResponse.statusCode)
  res.json({
    status: httpResponse.status,
    data: { message: new InternalError().message }
  })
}

export const refreshTokenResponse = (res: Response, httpResponse: HttpResponse): void => {
  createAccessTokenCookie(res, httpResponse)
  createRefreshTokenCookie(res, httpResponse)

  defaultResponse(res, httpResponse)
}
