import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { User } from '@/domain/user'

export class RefreshTokenRepository implements RefreshTokenRepositoryProtocol {
  createRefreshToken (user: User): RefreshToken {
    return {
      id: 'any_id',
      expiresIn: new Date(),
      user: user,
      userId: user.personal.id
    }
  }
}
