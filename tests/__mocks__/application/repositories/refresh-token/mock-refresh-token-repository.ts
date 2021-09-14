import { User } from '@/domain/user'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'

export const makeRefreshTokenRepositoryStub = (): RefreshTokenRepositoryProtocol => {
  class RefreshTokenRepositoryStub implements RefreshTokenRepositoryProtocol {
    createRefreshToken (user: User): RefreshToken {
      return makeFakeRefreshToken()
    }
  }

  return new RefreshTokenRepositoryStub()
}
