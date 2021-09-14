import { User } from '@/domain/user'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export interface RefreshTokenDbRepositoryProtocol {
  saveRefreshToken: (user: User) => Promise<RefreshToken>
}
