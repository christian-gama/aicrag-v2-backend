import { UserAccount } from '@domain/user/user-account-protocol'
import { User } from '@domain/user/user-protocol'

export interface Account {
  add: (account: UserAccount) => Promise<User>
  get: (id: User['personal']['id']) => Promise<User>
  update: (id: User['personal']['id']) => Promise<User>
  delete: (id: User['personal']['id']) => Promise<null>
}
