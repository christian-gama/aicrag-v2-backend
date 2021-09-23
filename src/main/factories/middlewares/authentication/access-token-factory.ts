import { AccessToken } from '@/presentation/middlewares/authentication/access-token'
import { makeHttpHelper } from '../../helpers'
import { makeVerifyAccessToken } from '../../providers/token'

export const makeAccessToken = (): AccessToken => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()

  return new AccessToken(httpHelper, verifyAccessToken)
}
