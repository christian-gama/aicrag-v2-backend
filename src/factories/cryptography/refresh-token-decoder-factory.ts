import { IDecoder } from '@/domain/cryptography'

import { JwtAdapter } from '@/infra/adapters/cryptography'

import { environment } from '@/main/config/environment'

export const makeRefreshTokenDecoder = (): IDecoder => {
  const expires = environment.JWT.REFRESH_EXPIRES
  const secret = environment.JWT.REFRESH_SECRET

  return new JwtAdapter(expires, secret)
}
