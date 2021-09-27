import { GenerateRefreshToken } from '@/infra/providers/token'

import { makeRefreshTokenEncrypter } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeGenerateRefreshToken = (): GenerateRefreshToken => {
  const refreshTokenEncrypter = makeRefreshTokenEncrypter()
  const userDbRepository = makeUserDbRepository()

  return new GenerateRefreshToken(refreshTokenEncrypter, userDbRepository)
}
