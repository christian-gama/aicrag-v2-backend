import { ISignUpUserCredentials, IUser } from '@/domain/user/index'
import { UserDbFilter } from '@/infra/database/mongodb/user/protocols/update-user-options'

/**
 * @description Generic user database repository.
 */
export interface UserDbRepositoryProtocol
  extends SaveUserDbProtocol,
  UpdateUserDbProtocol,
  FindUserByEmailDbProtocol,
  FindUserByIdDbProtocol {}

export interface SaveUserDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user and then save a user on database.
   * @param user User that will be saved as a user.
   * @returns Return a user from database.
   */
  saveUser: (user: ISignUpUserCredentials) => Promise<IUser>
}

export interface FindUserByEmailDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an email and tries to find it on database.
   * @param email The email that will be searched for.
   * @returns Return a user if finds it or undefined if does not.
   */
  findUserByEmail: (email: string) => Promise<IUser | undefined>
}

export interface FindUserByIdDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an user id and tries to find it on database.
   * @param id The user id that will be searched for.
   * @returns Return a user if finds it or undefined if does not.
   */
  findUserById: (id: string) => Promise<IUser | undefined>
}

export interface UpdateUserDbProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user and tries to update it.
   * @param user The user that will be updated.
   * @param update Object that contains the changes to be updated.
   * @returns Return a user if updates it or undefined if does not.
   */
  updateUser: (user: IUser, update: UserDbFilter) => Promise<IUser | undefined>
}
