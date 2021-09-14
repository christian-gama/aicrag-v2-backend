import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export interface RefreshTokenRepositoryProtocol {
  createRefreshToken: (userId: string) => RefreshToken
}
