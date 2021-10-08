import { ISignUpUserData, IUser } from '@/domain'

import { UserDbFilter } from '@/infra/database/protocols'

/**
 * @description Generic user database repository.
 */
export interface UserDbRepositoryProtocol
  extends SaveUserDbProtocol,
  FindUserByEmailDbProtocol,
  FindUserByIdDbProtocol,
  UpdateUserDbProtocol {}

export interface FindUserByEmailDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an email and tries to find it on database.
   * @param email The email that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findUserByEmail: (email: string) => Promise<IUser | null>
}

export interface FindUserByIdDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user id and tries to find it on database.
   * @param id The user id that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findUserById: (id: string) => Promise<IUser | null>
}

export interface SaveUserDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user and then save a user on database.
   * @param user User that will be saved as a user.
   * @returns Return the saved user.
   */
  saveUser: (user: ISignUpUserData) => Promise<IUser>
}

export interface UpdateUserDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user and tries to update it.
   * @param user The user that will be updated.
   * @param update Object that contains the changes to be updated.
   * @returns Return a user if updates it or null if does not.
   */
  updateUser: <T extends IUser | null>(user: T, update: UserDbFilter) => Promise<T>
}
