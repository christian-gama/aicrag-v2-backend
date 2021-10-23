import { makeIsLoggedInMiddleware } from '@/factories/middlewares'

import { contextAdapter } from '../adapters'

export const context = async ({ req, res }): Promise<Record<string, any>> => {
  const isLoggedIn = await contextAdapter(makeIsLoggedInMiddleware(), req, res)

  if (isLoggedIn.data.user) req.user = isLoggedIn.data.user

  return { req, res }
}
