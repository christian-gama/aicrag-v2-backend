import { VerifyRefreshToken } from '@/infra/token'

import { makeRefreshTokenDecoder } from '../../cryptography'
import { makeUserRepository } from '../../repositories'

export const makeVerifyRefreshToken = (): VerifyRefreshToken => {
  const refreshTokenDecoder = makeRefreshTokenDecoder()
  const userRepository = makeUserRepository()

  return new VerifyRefreshToken(refreshTokenDecoder, userRepository)
}
