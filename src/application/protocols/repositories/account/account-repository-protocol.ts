import { User, UserAccount } from '@/domain/user'

export interface AccountRepositoryProtocol {
  /**
   * @async Asynchronous method.
   * @description Receive an account create a user based on user protocols.
   * @param account Account that will serve the necessary data to create a user.
   * @returns Return a user.
   */
  createAccount: (account: UserAccount) => Promise<User>
}
