import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { User } from '@/domain/user'

export class RefreshTokenDbRepository implements RefreshTokenDbRepositoryProtocol {
  constructor (private readonly refreshTokenRepository: RefreshTokenRepositoryProtocol) {}

  async saveRefreshToken (user: User): Promise<RefreshToken> {
    const refreshToken = this.refreshTokenRepository.createRefreshToken(user)

    return refreshToken
  }
}
