import { GenerateRefreshToken } from '@/infra/providers/token'

import { makeJwtRefreshToken } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeGenerateRefreshToken = (): GenerateRefreshToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new GenerateRefreshToken(jwtRefreshToken, userDbRepository)
}
