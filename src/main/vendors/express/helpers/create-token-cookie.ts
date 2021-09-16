import { HttpResponse } from '@/presentation/helpers/http/protocols'
import { env } from '../../../config/env'

import { Response } from 'express'

export const createRefreshTokenCookie = (
  expressResponse: Response,
  httpResponse: HttpResponse
): Response<any, Record<any, string>> => {
  return expressResponse.cookie('refreshToken', httpResponse.data.refreshToken, {
    httpOnly: true,
    secure: env.SERVER.NODE_ENV === 'production'
  })
}

export const createAccessTokenCookie = (
  expressResponse: Response,
  httpResponse: HttpResponse
): Response<any, Record<any, string>> => {
  return expressResponse.cookie('jwt', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: env.SERVER.NODE_ENV === 'production'
  })
}
