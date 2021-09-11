import { User, UserAccount } from '@/domain/user'

export interface AccountRepositoryProtocol {
  createAccount: (account: UserAccount) => Promise<User>
}
