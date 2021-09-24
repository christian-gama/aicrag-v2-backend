import { IUser } from '@/domain'

import { InvalidTokenError } from '@/application/usecases/errors'

export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<InvalidTokenError | IUser>
}
