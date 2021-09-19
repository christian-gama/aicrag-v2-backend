import { IUser } from '@/domain/user'
import { VerifyTokenProtocol } from '@/application/protocols/providers/verify-token-protocol'

import { Request, Response, NextFunction } from 'express'

export const isLoggedInMiddlewareAdapter = (verifyRefreshToken: VerifyTokenProtocol) => {
  return async (req: AdaptHttpRequest, res: Response, next: NextFunction) => {
    try {
      const user = await verifyRefreshToken.verify(req.cookies?.refreshToken)

      req.user = undefined

      if (!(user instanceof Error)) {
        req.user = user
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

type AdaptHttpRequest = Request & { user: IUser | undefined }
