import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  const expires = env.JWT.EXPIRES
  const secret = env.JWT.SECRET

  return new JwtAdapter(expires, secret)
}
