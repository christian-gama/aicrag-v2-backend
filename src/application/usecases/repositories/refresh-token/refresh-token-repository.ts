import { UuidProtocol } from '@/application/protocols/helpers/uuid/uuid-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export class RefreshTokenRepository implements RefreshTokenRepositoryProtocol {
  constructor (private readonly uuid: UuidProtocol) {}

  createRefreshToken (userId: string): RefreshToken {
    return {
      id: this.uuid.generate(),
      expiresIn: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      userId: userId
    }
  }
}
