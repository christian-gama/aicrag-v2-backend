import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export interface RefreshTokenRepositoryProtocol {
  /**
   * @description Get a user id and create a refresh token based on the user id.
   * @param userId The user id that will be used to create a refresh token.
   * @returns Return a refresh token.
   */
  createRefreshToken: (userId: string) => RefreshToken
}
