import { VerifyResetPasswordToken } from '@/infra/providers/token'
import { makeJwtRefreshToken } from '../../cryptography'
import { makeUserDbRepository } from '../../repositories'

export const makeVerifyResetPasswordToken = (): VerifyResetPasswordToken => {
  const jwtRefreshToken = makeJwtRefreshToken()
  const userDbRepository = makeUserDbRepository()

  return new VerifyResetPasswordToken(jwtRefreshToken, userDbRepository)
}
