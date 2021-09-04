import { UserAccount } from '@/domain/user/user-account-protocol'
import { User } from '@/domain/user/user-protocol'

export interface AccountRepositoryProtocol {
  add: (account: UserAccount) => Promise<User>
}
