import { RefreshTokenDbRepository } from '@/infra/database/mongodb/refresh-token/refresh-token-db-repository'
import { makeRefreshTokenRepository } from '../refresh-token-repository/refresh-token-repository-factory'

export const makeRefreshTokenDbRepository = (): RefreshTokenDbRepository => {
  const refreshTokenRepository = makeRefreshTokenRepository()

  return new RefreshTokenDbRepository(refreshTokenRepository)
}
