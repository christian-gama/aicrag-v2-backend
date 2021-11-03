import { ISignUpUserData, IUser } from '@/domain'
import { IUserDbFilter } from '@/infra/database/protocols'
import { IQuery, IQueryResult } from '@/infra/database/protocols/queries-protocol'

/**
 * @description Generic user database repository.
 */
export interface IUserRepository extends IFindAllByID, IFindUserByEmail, IFindUserById, ISaveUser, IUpdateUser {}

export interface IFindAllByID {
  /**
   * @async Asynchronous method.
   * @description Receive an user id and tries to find it on database.
   * @param ids Array of user id that will be searched for.
   * @returns Return an array of user if finds it or an empty array if does not.
   */
  findAllById: <T extends IUser>(ids: string[], query: IQuery) => Promise<IQueryResult<T>>
}

export interface IFindUserByEmail {
  /**
   * @async Asynchronous method.
   * @description Receive an email and tries to find it on database.
   * @param email The email that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findByEmail: (email: string) => Promise<IUser | null>
}

export interface IFindUserById {
  /**
   * @async Asynchronous method.
   * @description Receive an user id and tries to find it on database.
   * @param id The user id that will be searched for.
   * @returns Return a user if finds it or null if does not.
   */
  findById: (id: string) => Promise<IUser | null>
}

export interface ISaveUser {
  /**
   * @async Asynchronous method.
   * @description Receive an user and then save a user on database.
   * @param userData User data that will be saved as a user.
   * @returns Return the saved user.
   */
  save: (userData: ISignUpUserData) => Promise<IUser>
}

export interface IUpdateUser {
  /**
   * @async Asynchronous method.
   * @description Receive a user and tries to update it.
   * @param id The id from the user that will be updated.
   * @param update Object that contains the changes to be updated.
   * @returns Return a user if updates it or null if does not.
   */
  updateById: <T extends IUser | null>(id: string, update: IUserDbFilter) => Promise<T>
}
