import { IUser, ISignUpUserCredentials } from '@/domain/user'

export interface UserRepositoryProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user credentials and create a user based on its protocols.
   * @param user User that will serve the necessary data to create a user.
   * @returns Return a user.
   */
  createUser: (signUpUserCredentials: ISignUpUserCredentials) => Promise<IUser>
}
