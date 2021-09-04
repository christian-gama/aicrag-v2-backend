import { UserAccount } from '@/domain/user/user-account-protocol'
import { User } from '@/domain/user/user-protocol'

export interface AccountProtocol {
  add: (account: UserAccount) => Promise<User>
  get: (id: User['personal']['id']) => Promise<User>
  update: (id: User['personal']['id']) => Promise<User>
  remove: (id: User['personal']['id']) => Promise<null>
}
