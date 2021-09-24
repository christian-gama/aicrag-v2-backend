import { HttpResponse } from '@/presentation/helpers/http/protocols'

import { environment } from '@/main/config/environment'

import { Response } from 'express'

type Cookie = Response<any, Record<any, string>>

export const createAccessTokenCookie = (res: Response, httpResponse: HttpResponse): Cookie => {
  return res.cookie('accessToken', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })
}

export const createRefreshTokenCookie = (res: Response, httpResponse: HttpResponse): Cookie => {
  return res.cookie('refreshToken', httpResponse.data.refreshToken, {
    httpOnly: true,
    secure: environment.SERVER.NODE_ENV === 'production'
  })
}
