import { IUser, ISignUpUserData } from '@/domain/user'

export interface CreateUserRepositoryProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive a user data and create a user based on its protocols.
   * @param user User that will serve the necessary data to create a user.
   * @returns Return a user.
   */
  createUser: (signUpUserData: ISignUpUserData) => Promise<IUser>
}
