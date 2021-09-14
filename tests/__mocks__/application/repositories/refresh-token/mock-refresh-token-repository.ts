import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { RefreshTokenRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-repository-protocol'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'

export const makeRefreshTokenRepositoryStub = (): RefreshTokenRepositoryProtocol => {
  class RefreshTokenRepositoryStub implements RefreshTokenRepositoryProtocol {
    createRefreshToken (userId: string): RefreshToken {
      return makeFakeRefreshToken()
    }
  }

  return new RefreshTokenRepositoryStub()
}
