import { UserAccount, User } from '@/domain/user'

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
}
