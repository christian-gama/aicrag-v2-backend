/**
 * @description Interface used to create a refresh token.
 */
export interface RefreshToken {
  id: string
  expiresIn: Date
  userId: string
}
