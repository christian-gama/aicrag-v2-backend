import { VerifyAccessToken } from '@/infra/token'

import { makeAccessTokenDecoder } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyAccessToken = (): VerifyAccessToken => {
  const accessTokenDecoder = makeAccessTokenDecoder()
  const userDbRepository = makeUserDbRepository()

  return new VerifyAccessToken(accessTokenDecoder, userDbRepository)
}
