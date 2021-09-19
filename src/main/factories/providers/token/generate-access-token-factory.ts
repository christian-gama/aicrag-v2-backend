import { GenerateAccessToken } from '@/infra/providers/token/generate-access-token'
import { makeJwtAccessToken } from '../../cryptography/jwt-access-token-factory'

export const makeGenerateAccessToken = (): GenerateAccessToken => {
  const jwtAccessToken = makeJwtAccessToken()

  return new GenerateAccessToken(jwtAccessToken)
}
