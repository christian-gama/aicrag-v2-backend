import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'

import { environment } from '@/main/config/environment'

import {
  makeIsLoggedInMiddleware,
  makePartialProtectedMiddleware,
  makeProtectedMiddleware
} from '@/factories/middlewares'

import { Request, Response } from 'express'

export const context = async ({ req, res }): Promise<Record<string, any>> => {
  const isPartialAuthenticated = await partialProtectedMiddleware(req)
  const isAuthenticated = await protectedMiddleware(req, res)
  const user = await isLoggedInMiddleware(req)

  if (user) req.user = user

  return { isAuthenticated, isPartialAuthenticated, req, res }
}

const protectedMiddleware = async (req: Request, res: Response): Promise<boolean | string> => {
  const protectedMiddleware = makeProtectedMiddleware()

  const httpResponse = await protectedMiddleware.handle(req)

  if (httpResponse.statusCode === 401) {
    return httpResponse.data.message
  }

  if (httpResponse.data.refreshToken) {
    res.cookie('accessToken', httpResponse.data.accessToken, {
      httpOnly: true,
      secure: environment.SERVER.NODE_ENV === 'production'
    })

    req.cookies.accessToken = httpResponse.data.accessToken
  }

  return true
}

const partialProtectedMiddleware = async (req: Request): Promise<boolean | string> => {
  const partialProtectedMiddleware = makePartialProtectedMiddleware()

  const httpResponse = await partialProtectedMiddleware.handle(req)

  if (httpResponse.statusCode === 401) {
    return httpResponse.data.message
  }

  return true
}

const isLoggedInMiddleware = async (req: AdaptRequest): Promise<HttpResponse | undefined> => {
  const isLoggedInMiddleware = makeIsLoggedInMiddleware()

  const httpResponse = await isLoggedInMiddleware.handle(req)

  if (httpResponse.data.user) return httpResponse.data.user
}

type AdaptRequest = Request & Pick<HttpRequest, 'user'>
