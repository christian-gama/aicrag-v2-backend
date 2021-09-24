import { InvalidTokenError } from '@/application/usecases/errors'
import { IUser } from '@/domain'

export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<InvalidTokenError | IUser>
}
