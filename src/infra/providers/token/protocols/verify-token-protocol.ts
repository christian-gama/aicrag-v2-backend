import { IUser } from '@/domain/user/index'

export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<Error | IUser>
}
