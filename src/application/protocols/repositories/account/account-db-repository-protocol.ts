import { UserAccount, User } from '@/domain/user'
import { UpdateUserOptions } from '@/infra/database/mongodb/account/protocols/update-user-options'

/**
 * @description Generic account database repository.
 */
export interface AccountDbRepositoryProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an account and then save a user on database.
   * @param account Account that will be saved as a user.
   * @returns Return a user from database.
   */
  saveAccount: (account: UserAccount) => Promise<User>

  /**
   * @async Asynchronous method.
   * @description Receive an email and tries to find it on database.
   * @param email The first value that will be compared to the second value.
   * @returns Return a user if finds it or undefined if does not.
   */
  findAccountByEmail: (email: string) => Promise<User | undefined>

  /**
   * @async Asynchronous method.
   * @description Receive a user and tries to update it.
   * @param user The user that will be updated.
   * @param update Object that contains the changes to be updated.
   * @returns Return a user if updates it or undefined if does not.
   */
  updateUser: (user: User, update: UpdateUserOptions) => Promise<User | undefined>
}
