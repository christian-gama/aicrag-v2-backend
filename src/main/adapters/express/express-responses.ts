import { InternalError } from '@/application/usecases/errors'
import { HttpResponse } from '@/presentation/helpers/http/protocols'
import { env } from '@/main/config/env'

import { Response } from 'express'

export const accessTokenResponse = (expressResponse: Response, httpResponse: HttpResponse): any => {
  expressResponse.cookie('jwt', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: env.SERVER.NODE_ENV === 'production'
  })

  expressResponse.json({
    status: httpResponse.status,
    httpResponse: httpResponse.data
  })
}

export const defaultResponse = (expressResponse: Response, httpResponse: HttpResponse): any => {
  expressResponse.json({
    status: httpResponse.status,
    httpResponse: httpResponse.data,
    accessToken: httpResponse.data.accessToken
  })
}

export const productionErrorResponse = (
  expressResponse: Response,
  httpResponse: HttpResponse
): any => {
  expressResponse.json({
    status: httpResponse.status,
    httpResponse: { message: new InternalError().message }
  })
}

export const refreshTokenResponse = (
  expressResponse: Response,
  httpResponse: HttpResponse
): any => {
  expressResponse.cookie('jwt', httpResponse.data.accessToken, {
    httpOnly: true,
    secure: env.SERVER.NODE_ENV === 'production'
  })

  expressResponse.cookie('refreshToken', httpResponse.data.refreshToken, {
    httpOnly: true,
    secure: env.SERVER.NODE_ENV === 'production'
  })

  expressResponse.json({
    status: httpResponse.status,
    httpResponse: httpResponse.data
  })
}
