import { VerifyRefreshToken } from '@/infra/providers/token/verify-refresh-token'
import { makeJwtRefreshToken } from '@/main/factories/cryptography/jwt-refresh-token-factory'
import { makeUserDbRepository } from '../../repositories/user/user-db-repository/user-db-repository-factory'

export const makeVerifyRefreshToken = (): VerifyRefreshToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyRefreshToken(jwtRefreshToken, userDbRepository)
}
