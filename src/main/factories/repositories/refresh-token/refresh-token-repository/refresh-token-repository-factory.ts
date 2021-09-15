import { RefreshTokenRepository } from '@/application/usecases/repositories/refresh-token/refresh-token-repository'
import { makeUuid } from '@/main/factories/helpers/uuid-factory'

export const makeRefreshTokenRepository = (): RefreshTokenRepository => {
  const uuid = makeUuid()

  return new RefreshTokenRepository(uuid)
}
