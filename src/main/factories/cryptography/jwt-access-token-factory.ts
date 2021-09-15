import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'

export const makeJwtAccessToken = (): JwtAdapter => {
  const expires = env.JWT.ACCESS_EXPIRES
  const secret = env.JWT.ACCESS_SECRET

  return new JwtAdapter(expires, secret)
}
