import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'

export const makeJwtRefreshToken = (): JwtAdapter => {
  const expires = env.JWT.REFRESH_EXPIRES
  const secret = env.JWT.REFRESH_SECRET

  return new JwtAdapter(expires, secret)
}
