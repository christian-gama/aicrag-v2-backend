import { VerifyAccessToken } from '@/infra/providers/token'
import { makeJwtAccessToken } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyAccessToken = (): VerifyAccessToken => {
  const jwtAccessToken = makeJwtAccessToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyAccessToken(jwtAccessToken, userDbRepository)
}
