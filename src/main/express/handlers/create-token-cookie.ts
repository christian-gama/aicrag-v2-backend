import { HttpResponse } from '@/presentation/http/protocols'

import { environment } from '@/main/config/environment'

import { Response } from 'express'

type Cookie = Response<any, Record<any, string>>

export const createAccessTokenCookie = (res: Response, httpResponse: HttpResponse): Cookie => {
  res.cookie('accessToken', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })

  res.header('X-Access-Token', httpResponse.data.accessToken)

  return res
}

export const createRefreshTokenCookie = (res: Response, httpResponse: HttpResponse): Cookie => {
  res.cookie('refreshToken', httpResponse.data.refreshToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })

  res.header('X-Refresh-Token', httpResponse.data.refreshToken)

  return res
}
