import { VerifyRefreshToken } from '@/infra/token'

import { makeRefreshTokenDecoder } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyRefreshToken = (): VerifyRefreshToken => {
  const refreshTokenDecoder = makeRefreshTokenDecoder()
  const userDbRepository = makeUserDbRepository()

  return new VerifyRefreshToken(refreshTokenDecoder, userDbRepository)
}
