import { GenerateRefreshToken } from '@/infra/providers/generate-refresh-token'
import { makeJwtRefreshToken } from '../cryptography/jwt-refresh-token-factory'
import { makeUserDbRepository } from '../repositories/user/user-db-repository/user-db-repository-factory'

export const makeGenerateRefreshToken = (): GenerateRefreshToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new GenerateRefreshToken(jwtRefreshToken, userDbRepository)
}
