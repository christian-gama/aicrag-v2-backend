import { IUser } from '@/domain'

export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<Error | IUser>
}
