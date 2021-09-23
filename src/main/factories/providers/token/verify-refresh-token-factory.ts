import { VerifyRefreshToken } from '@/infra/providers/token'
import { makeJwtRefreshToken } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyRefreshToken = (): VerifyRefreshToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyRefreshToken(jwtRefreshToken, userDbRepository)
}
