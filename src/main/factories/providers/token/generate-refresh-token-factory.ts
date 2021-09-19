import { GenerateRefreshToken } from '@/infra/providers/token/generate-refresh-token'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeUserDbRepository } from '@/main/factories/repositories/user/user-db-repository/user-db-repository-factory'

export const makeGenerateRefreshToken = (): GenerateRefreshToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new GenerateRefreshToken(jwtRefreshToken, userDbRepository)
}
