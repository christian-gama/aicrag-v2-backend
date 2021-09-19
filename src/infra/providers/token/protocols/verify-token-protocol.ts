import { User } from '@/domain/user'

export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<Error | User>
}
