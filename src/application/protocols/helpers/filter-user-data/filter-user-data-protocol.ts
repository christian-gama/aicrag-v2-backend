import { PublicUser, IUser } from '@/domain/user/index'

export interface FilterUserDataProtocol {
  /**
   * @description Get a user and filter sensitive information from that user, returning a filtered data.
   * @param user The user that will be filtered.
   * @returns Return a public user that has a filter sensitive information hidden.
   */
  filter: (user: IUser) => PublicUser
}
