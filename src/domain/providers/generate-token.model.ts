import { IUser } from '@/domain'

export interface IGenerateToken {
  /**
   * @description Get a user id and create a token based on the user id.
   * @param user The user that will be used to create a token.
   * @returns Return a token.
   */
  generate: (user: IUser) => string | Promise<string>
}
