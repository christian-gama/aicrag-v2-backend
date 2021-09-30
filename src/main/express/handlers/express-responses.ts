import { InternalError } from '@/application/errors'

import { HttpResponse } from '@/presentation/http/protocols'

import { createAccessTokenCookie, createRefreshTokenCookie } from './create-token-cookie'

import { Response } from 'express'

export const accessTokenResponse = (res: Response, httpResponse: HttpResponse): void => {
  createAccessTokenCookie(res, httpResponse)

  defaultResponse(res, httpResponse)
}

export const defaultResponse = (res: Response, httpResponse: HttpResponse): void => {
  res.status(httpResponse.statusCode)
  res.json({
    data: httpResponse.data,
    status: httpResponse.status
  })
}

export const productionErrorResponse = (res: Response, httpResponse: HttpResponse): void => {
  res.status(httpResponse.statusCode)
  res.json({
    data: { message: new InternalError().message },
    status: httpResponse.status
  })
}

export const refreshTokenResponse = (res: Response, httpResponse: HttpResponse): void => {
  createAccessTokenCookie(res, httpResponse)
  createRefreshTokenCookie(res, httpResponse)

  defaultResponse(res, httpResponse)
}
