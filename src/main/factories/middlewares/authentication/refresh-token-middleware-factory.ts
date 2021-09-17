import { RefreshTokenMiddleware } from '@/presentation/middlewares/authentication/refresh-token'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeRefreshTokenDbRepository } from '@/main/factories/repositories/refresh-token/refresh-token-db-repository/refresh-token-db-repository-factory'
import { makeBcryptAdapter } from '../../cryptography/bcrypt-adapter-factory'
import { makeUserDbRepository } from '../../repositories/user/user-db-repository/user-db-repository-factory'

export const makeRefreshTokenMiddleware = (): RefreshTokenMiddleware => {
  const comparer = makeBcryptAdapter()
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const jwtRefreshToken = makeJwtRefreshToken()
  const refreshTokenDbRepository = makeRefreshTokenDbRepository()
  const userDbRepository = makeUserDbRepository()

  return new RefreshTokenMiddleware(comparer, httpHelper, jwtAccessToken, jwtRefreshToken, refreshTokenDbRepository, userDbRepository)
}
