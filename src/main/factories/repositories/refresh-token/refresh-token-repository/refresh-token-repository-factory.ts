import { RefreshTokenRepository } from '@/application/usecases/repositories/refresh-token/refresh-token-repository'
import { makeBcryptAdapter } from '@/main/factories/cryptography/bcrypt-adapter-factory'
import { makeUuid } from '@/main/factories/helpers/uuid-factory'

export const makeRefreshTokenRepository = (): RefreshTokenRepository => {
  const hasher = makeBcryptAdapter()
  const uuid = makeUuid()

  return new RefreshTokenRepository(hasher, uuid)
}
