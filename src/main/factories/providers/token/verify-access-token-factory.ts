import { VerifyAccessToken } from '@/infra/token'
import { makeAccessTokenDecoder } from '../../cryptography'
import { makeUserRepository } from '../../repositories'

export const makeVerifyAccessToken = (): VerifyAccessToken => {
  const accessTokenDecoder = makeAccessTokenDecoder()
  const userRepository = makeUserRepository()

  return new VerifyAccessToken(accessTokenDecoder, userRepository)
}
