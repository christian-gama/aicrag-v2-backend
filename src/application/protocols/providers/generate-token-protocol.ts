import { User } from '@/domain/user'

export interface GenerateTokenProtocol {
  /**
   * @description Get a user id and create a token based on the user id.
   * @param user The user that will be used to create a token.
   * @returns Return a token.
   */
  generate: (user: User) => string | Promise<string>
}
