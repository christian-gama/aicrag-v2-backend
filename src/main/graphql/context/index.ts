import {
  makeIsLoggedInMiddleware,
  makePartialProtectedMiddleware,
  makeProtectedMiddleware
} from '@/factories/middlewares'

import { apolloMiddlewareAdapter } from '../adapters'

export const context = async ({ req, res }): Promise<Record<string, any>> => {
  const isLoggedIn = await apolloMiddlewareAdapter(makeIsLoggedInMiddleware(), req, res)
  const isProtected = await apolloMiddlewareAdapter(makeProtectedMiddleware(), req, res)
  const isPartialProtected = await apolloMiddlewareAdapter(
    makePartialProtectedMiddleware(),
    req,
    res
  )

  if (isLoggedIn.data.user) req.user = isLoggedIn.data.user

  return { isPartialProtected, isProtected, req, res }
}
