import { VerifyResetPasswordToken } from '@/infra/providers/token'

import { makeJwtAccessToken } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyResetPasswordToken = (): VerifyResetPasswordToken => {
  const jwtAccessToken = makeJwtAccessToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyResetPasswordToken(jwtAccessToken, userDbRepository)
}
