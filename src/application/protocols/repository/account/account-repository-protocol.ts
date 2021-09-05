import { UserAccount } from '@/domain/user/user-account-protocol'
import { User } from '@/domain/user/user-protocol'

export interface AccountRepositoryProtocol {
  saveAccount: (account: UserAccount) => Promise<User>
}
