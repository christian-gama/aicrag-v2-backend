import { VerifyResetPasswordToken } from '@/infra/token'
import { makeAccessTokenDecoder } from '../../cryptography'
import { makeUserRepository } from '../../repositories'

export const makeVerifyResetPasswordToken = (): VerifyResetPasswordToken => {
  const accessTokenDecoder = makeAccessTokenDecoder()
  const userRepository = makeUserRepository()

  return new VerifyResetPasswordToken(accessTokenDecoder, userRepository)
}
