import { VerifyAccessToken } from '@/presentation/middlewares/authentication/access-token'
import { makeHttpHelper } from '@/main/factories/helpers/http-helper-factory'
import { makeJwtAccessToken } from '@/main/factories/cryptography/jwt-access-token-factory'
import { makeUserDbRepository } from '../../repositories/user/user-db-repository/user-db-repository-factory'

export const makeVerifyAccessToken = (): VerifyAccessToken => {
  const httpHelper = makeHttpHelper()
  const jwtAccessToken = makeJwtAccessToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyAccessToken(httpHelper, jwtAccessToken, userDbRepository)
}
