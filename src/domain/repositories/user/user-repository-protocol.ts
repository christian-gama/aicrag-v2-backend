import { ISignUpUserData, IUser } from '@/domain'

import { UserDbFilter } from '@/infra/database/protocols'

/**
 * @description Generic user database repository.
 */
export interface UserRepositoryProtocol
  extends SaveUserProtocol,
  FindUserByEmailProtocol,
  FindUserByIdProtocol,
  UpdateUserProtocol {}

export interface FindUserByEmailProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an email and tries to find it on database.
   * @param email The email that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findUserByEmail: (email: string) => Promise<IUser | null>
}

export interface FindUserByIdProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user id and tries to find it on database.
   * @param id The user id that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findUserById: (id: string) => Promise<IUser | null>
}

export interface SaveUserProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user and then save a user on database.
   * @param userData User data that will be saved as a user.
   * @returns Return the saved user.
   */
  saveUser: (userData: ISignUpUserData) => Promise<IUser>
}

export interface UpdateUserProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user and tries to update it.
   * @param id The id from the user that will be updated.
   * @param update Object that contains the changes to be updated.
   * @returns Return a user if updates it or null if does not.
   */
  updateUser: <T extends IUser | null>(id: string, update: UserDbFilter) => Promise<T>
}
