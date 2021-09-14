import { RefreshTokenDbRepositoryProtocol } from '@/application/protocols/repositories/refresh-token/refresh-token-db-repository-protocol'
import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'
import { makeFakeRefreshToken } from '@/tests/__mocks__/domain/mock-refresh-token'

export const makeRefreshTokenDbRepositoryStub = (): RefreshTokenDbRepositoryProtocol => {
  class RefreshTokenDbRepositoryStub implements RefreshTokenDbRepositoryProtocol {
    async saveRefreshToken (userId: string): Promise<RefreshToken> {
      return Promise.resolve(makeFakeRefreshToken())
    }

    async findRefreshTokenByUserId (userId: string): Promise<RefreshToken> {
      return Promise.resolve(makeFakeRefreshToken())
    }

    async deleteRefreshTokenById (userId: string): Promise<number> {
      return Promise.resolve(0)
    }
  }

  return new RefreshTokenDbRepositoryStub()
}
