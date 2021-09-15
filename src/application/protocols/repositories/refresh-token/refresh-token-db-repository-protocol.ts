import { RefreshToken } from '@/domain/refresh-token/refresh-token-protocol'

export interface RefreshTokenDbRepositoryProtocol
  extends DeleteRefreshTokenByIdDbProtocol,
  FindRefreshTokenByIdDbProtocol,
  SaveRefreshTokenDbProtocol {}

export interface DeleteRefreshTokenByIdDbProtocol {
  /**
   * @description Get an id and delete a refresh token from database with that id.
   * @param id The id from refresh token on database.
   * @returns Return the amount of deleted refresh tokens.
   */
  deleteRefreshTokenById: (id: string) => Promise<number>
}

/**
   * @description Get a user id, create a refresh token and save it on database.
   * @param userId The user id that will be saved on refresh token database.
   * @returns Return the saved refresh token.
   */
export interface SaveRefreshTokenDbProtocol {
  saveRefreshToken: (userId: string) => Promise<RefreshToken>
}

/**
   * @description Get a refresh token id and return a refresh token if finds it on database.
   * @param id The id from refresh token on database.
   * @returns Return the refresh token that was found.
   */
export interface FindRefreshTokenByIdDbProtocol {
  findRefreshTokenById: (id: string) => Promise<RefreshToken | undefined>
}
