import { GenerateAccessToken } from '@/infra/token'
import { makeAccessTokenEncrypter } from '../../cryptography'

export const makeGenerateAccessToken = (): GenerateAccessToken => {
  const accessTokenEncrypter = makeAccessTokenEncrypter()

  return new GenerateAccessToken(accessTokenEncrypter)
}
