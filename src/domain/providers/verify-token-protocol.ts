import { IUser } from '@/domain'

import { InvalidTokenError } from '@/application/errors'

/**
 * @description Generic interface that is used to verify a token.
 */
export interface VerifyTokenProtocol {
  verify: (token: string | undefined) => Promise<InvalidTokenError | IUser>
}
