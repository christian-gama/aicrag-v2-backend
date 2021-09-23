import { GenerateAccessToken } from '@/infra/providers/token'
import { makeJwtAccessToken } from '../../cryptography'

export const makeGenerateAccessToken = (): GenerateAccessToken => {
  const jwtAccessToken = makeJwtAccessToken()

  return new GenerateAccessToken(jwtAccessToken)
}
