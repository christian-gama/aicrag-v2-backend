import { IDecoder } from '@/domain/cryptography'
import { JwtAdapter } from '@/infra/adapters/cryptography'
import { environment } from '@/main/config/environment'

export const makeAccessTokenDecoder = (): IDecoder => {
  const expires = environment.JWT.ACCESS_EXPIRES
  const secret = environment.JWT.ACCESS_SECRET

  return new JwtAdapter(expires, secret)
}
