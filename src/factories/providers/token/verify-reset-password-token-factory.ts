import { VerifyResetPasswordToken } from '@/infra/token'

import { makeAccessTokenDecoder } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyResetPasswordToken = (): VerifyResetPasswordToken => {
  const accessTokenDecoder = makeAccessTokenDecoder()
  const userDbRepository = makeUserDbRepository()

  return new VerifyResetPasswordToken(accessTokenDecoder, userDbRepository)
}
