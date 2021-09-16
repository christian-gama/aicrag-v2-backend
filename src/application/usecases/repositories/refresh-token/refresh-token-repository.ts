import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { HasherProtocol } from '@/application/protocols/cryptography'

export class RefreshTokenRepository implements RefreshTokenRepositoryProtocol {
  constructor (private readonly hasher: HasherProtocol, private readonly uuid: UuidProtocol) {}

  async createRefreshToken (userId: string): Promise<RefreshToken> {
    return {
      id: this.uuid.generate(),
      // expiresIn must have the same expiration from env.JWT.REFRESH_EXPIRES
      expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      userId: await this.hasher.hash(userId)
    }
  }
}
