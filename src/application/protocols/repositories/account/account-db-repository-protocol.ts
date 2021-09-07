import { UserAccount, User } from '@/domain/user'

export interface AccountDbRepositoryProtocol {
  saveAccount: (account: UserAccount) => Promise<User>
  findAccountByEmail: (email: string) => Promise<User | undefined>
}
