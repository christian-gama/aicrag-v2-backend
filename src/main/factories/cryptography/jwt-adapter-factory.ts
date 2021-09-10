import { JwtAdapter } from '@/infra/adapters/cryptography/jwt/jwt-adapter'
import { env } from '@/main/config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  const secret = env.JWT_SECRET
  const expires = env.JWT_EXPIRES

  return new JwtAdapter(secret, expires)
}
