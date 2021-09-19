import { VerifyAccessToken } from '@/infra/providers/token/verify-access-token'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeUserDbRepository } from '../../repositories/user/user-db-repository/user-db-repository-factory'

export const makeVerifyAccessToken = (): VerifyAccessToken => {
  const jwtAccessToken = makeJwtAccessToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyAccessToken(jwtAccessToken, userDbRepository)
}
