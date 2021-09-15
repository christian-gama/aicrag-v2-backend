import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeRefreshTokenDbRepository } from '@/main/factories/repositories/refresh-token/refresh-token-db-repository/refresh-token-db-repository-factory'

export const makeRefreshTokenMiddleware = (): RefreshTokenMiddleware => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const jwtRefreshToken = makeJwtRefreshToken()
  const refreshTokenDbRepository = makeRefreshTokenDbRepository()

  return new RefreshTokenMiddleware(httpHelper, jwtAccessToken, jwtRefreshToken, refreshTokenDbRepository)
}
