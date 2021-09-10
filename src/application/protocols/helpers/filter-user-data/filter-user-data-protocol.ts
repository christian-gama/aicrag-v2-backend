import { PublicUser, User } from '@/domain/user'

export interface FilterUserDataProtocol {
  filter: (user: User) => PublicUser
}
