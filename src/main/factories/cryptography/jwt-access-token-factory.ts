import { JwtAdapter } from '@/infra/adapters/cryptography'

import { environment } from '@/main/config/environment'

export const makeJwtAccessToken = (): JwtAdapter => {
  const expires = environment.JWT.ACCESS_EXPIRES
  const secret = environment.JWT.ACCESS_SECRET

  return new JwtAdapter(expires, secret)
}
