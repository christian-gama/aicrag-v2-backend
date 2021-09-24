import { HttpResponse } from '@/presentation/helpers/http/protocols'

import { environment } from '@/main/config/environment'

import { Response } from 'express'

export const createRefreshTokenCookie = (
  expressResponse: Response,
  httpResponse: HttpResponse
): Response<any, Record<any, string>> => {
  return expressResponse.cookie('refreshToken', httpResponse.data.refreshToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })
}

export const createAccessTokenCookie = (
  expressResponse: Response,
  httpResponse: HttpResponse
): Response<any, Record<any, string>> => {
  return expressResponse.cookie('accessToken', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })
}
