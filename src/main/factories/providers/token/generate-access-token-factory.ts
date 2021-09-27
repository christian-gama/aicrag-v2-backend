import { GenerateAccessToken } from '@/infra/providers/token'

import { makeAccessTokenEncrypter } from '../../cryptography'

export const makeGenerateAccessToken = (): GenerateAccessToken => {
  const accessTokenEncrypter = makeAccessTokenEncrypter()

  return new GenerateAccessToken(accessTokenEncrypter)
}
