import { AccessToken } from '@/presentation/middlewares/authentication/access-token'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeVerifyAccessToken } from '../../providers/token/verify-access-token-factory'

export const makeAccessToken = (): AccessToken => {
  const httpHelper = makeHttpHelper()
  const verifyAccessToken = makeVerifyAccessToken()

  return new AccessToken(httpHelper, verifyAccessToken)
}
