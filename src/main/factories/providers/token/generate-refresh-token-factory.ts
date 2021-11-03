import { GenerateRefreshToken } from '@/infra/token'
import { makeRefreshTokenEncrypter } from '../../cryptography'
import { makeUserRepository } from '../../repositories'

export const makeGenerateRefreshToken = (): GenerateRefreshToken => {
  const refreshTokenEncrypter = makeRefreshTokenEncrypter()
  const userRepository = makeUserRepository()

  return new GenerateRefreshToken(refreshTokenEncrypter, userRepository)
}
