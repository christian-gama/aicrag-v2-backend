import { UserAccount } from '@/domain/user/user-account-protocol'
import { User } from '@/domain/user/user-protocol'

export interface AccountRepositoryProtocol {
  createAccount: (account: UserAccount) => Promise<User>
}
