import { User } from '../user'

export interface RefreshToken {
  id: string
  expiresIn: Date
  user: User
  userId: string
}
