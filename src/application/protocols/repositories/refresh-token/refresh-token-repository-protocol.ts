import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { User } from '@/domain/user'

export interface RefreshTokenRepositoryProtocol {
  createRefreshToken: (user: User) => RefreshToken
}
