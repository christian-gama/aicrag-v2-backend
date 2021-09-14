import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export interface RefreshTokenDbRepositoryProtocol extends SaveRefreshTokenDbProtocol, FindRefreshTokenByIdDbProtocol {}

export interface SaveRefreshTokenDbProtocol {
  saveRefreshToken: (userId: string) => Promise<RefreshToken>
}

export interface FindRefreshTokenByIdDbProtocol {
  findRefreshTokenByUserId: (userId: string) => Promise<RefreshToken | undefined>
}
